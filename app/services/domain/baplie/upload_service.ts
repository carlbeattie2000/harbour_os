import { Baplie, type Voyage, type BaplieContainer } from '#domain/baplie/index'
import { BaplieUploadError, UnauthorisedAccessForVoyage } from '#errors/baplie_upload_errors'
import { PortCallNotFound } from '#errors/port_call_errors'
import Container from '#models/container'
import PortCall from '#models/port_call'
import StowagePlan from '#models/stowage_plan'
import iso6456_parser from '#utils/iso6456_parser'
import db from '@adonisjs/lucid/services/db'
import { randomUUID } from 'node:crypto'

interface StowagePlanDiff {
  added: string[]
  removed: string[]
  unchanged: number
}

type HandleBaplieUploadResult =
  | { status: 'success'; voyageNumber: string }
  | { status: 'conflict'; diff: StowagePlanDiff; cacheId: string }
  | { status: 'abort'; reason: string }

type HandleBaplieMergeResult =
  | { status: 'success'; voyageNumber: string }
  | { status: 'abort'; reason: string }

type VoyageStowageViewResult = {
  status: 'success'
  portCall: PortCall
  stowagePlans: StowagePlan[]
}

const cache: Map<string, Buffer> = new Map()

export class UploadService {
  getBaplieVoyage(baplie: string) {
    try {
      return new Baplie(baplie).process()
    } catch {
      throw new BaplieUploadError()
    }
  }

  cacheBaplie(content: string): string {
    const id = randomUUID()

    cache.set(id, Buffer.from(content))

    return id
  }

  deleteBaplieFromCache(cacheId: string) {
    cache.delete(cacheId)
  }

  getCachedBaplie(id: string): string {
    const buffer = cache.get(id)

    return buffer ? buffer.toString() : ''
  }

  async #computeDifference(
    portCallId: number,
    containers: BaplieContainer[]
  ): Promise<StowagePlanDiff> {
    const stowagePlans = await StowagePlan.query().where('portCallId', portCallId)

    const existingSet = new Set<string>(
      stowagePlans.map((stowagePlan) => stowagePlan.containerId.toString())
    )
    const uploadedSet = new Set<string>(containers.map((container) => container.number ?? ''))

    const newContainers = uploadedSet.difference(existingSet)
    const removedContainers = existingSet.difference(uploadedSet)
    const unchanged = existingSet.intersection(uploadedSet).size

    return {
      added: Array.from(newContainers),
      removed: Array.from(removedContainers),
      unchanged: unchanged,
    }
  }

  async #getPortCall(voyageNumber: string, shippingLineId: number | null): Promise<PortCall> {
    const portCall = await PortCall.query().where('voyageNumber', voyageNumber).first()
    if (!portCall) {
      throw new PortCallNotFound()
    }

    if (shippingLineId) {
      await portCall.load('vessel')

      if (portCall.vessel.shippingLineId !== shippingLineId) {
        throw new UnauthorisedAccessForVoyage()
      }
    }

    return portCall
  }

  async #uploadContainers(voyage: Voyage, portCall: PortCall): Promise<void> {
    await db.transaction(async (trx) => {
      await StowagePlan.query({ client: trx }).where('portCallId', portCall.id).delete()

      for (const container of voyage.containers) {
        if (container.number) {
          let systemContainerResult = await Container.query({ client: trx })
            .where('id', container.number)
            .first()

          if (!systemContainerResult) {
            const parsedContainerNumber = iso6456_parser(container.number)
            systemContainerResult = await Container.create(
              {
                id: container.number,
                ownerCode: parsedContainerNumber.ownerCode,
                serialNumber: parsedContainerNumber.serial,
                categoryIndentifier: parsedContainerNumber.category,
                checkDigit: parsedContainerNumber.checkDigit,
                sizeType: container.isoSizeType,
              },
              { client: trx }
            )
          }

          await StowagePlan.create(
            {
              portCallId: portCall.id,
              containerId: systemContainerResult.id,
              operation: 'LOAD',
              bay: container.position.bay,
              row: container.position.row,
              tier: container.position.tier,
            },
            { client: trx }
          )
        }
      }
    })
  }

  async handleBaplieMerge(
    cacheId: string,
    context: { shippingLineId: number | null }
  ): Promise<HandleBaplieMergeResult> {
    const baplieContent = this.getCachedBaplie(cacheId)

    if (baplieContent === '') {
      return {
        status: 'abort',
        reason: 'no valid cached baplie found matching this id',
      }
    }

    const voyage = this.getBaplieVoyage(baplieContent)
    const portCall = await this.#getPortCall(voyage.number, context?.shippingLineId)

    await this.#uploadContainers(voyage, portCall)

    return {
      status: 'success',
      voyageNumber: voyage.number,
    }
  }

  async handleBaplieUpload(
    baplie: string,
    context: { shippingLineId: number | null }
  ): Promise<HandleBaplieUploadResult> {
    const voyage = this.getBaplieVoyage(baplie)

    const portCall = await this.#getPortCall(voyage.number, context.shippingLineId)

    const hasStowagePlanEntry = await StowagePlan.query().where('portCallId', portCall.id).first()

    if (hasStowagePlanEntry) {
      const diffResult = await this.#computeDifference(portCall.id, voyage.containers)

      if (diffResult.added.length === 0 && diffResult.removed.length === 0) {
        return { status: 'abort', reason: 'no baplie changes detected' }
      }

      const cachedBaplieId = this.cacheBaplie(baplie)
      return { status: 'conflict', diff: diffResult, cacheId: cachedBaplieId }
    }

    await this.#uploadContainers(voyage, portCall)

    return {
      status: 'success',
      voyageNumber: voyage.number,
    }
  }

  async getStowagePlansForVoyage(
    voyageNumber: string,
    context: { shippingLineId: number | null }
  ): Promise<VoyageStowageViewResult> {
    const portCall = await this.#getPortCall(voyageNumber, context.shippingLineId)
    const stowagePlans = await StowagePlan.query().where('portCallId', portCall.id)

    return {
      status: 'success',
      portCall,
      stowagePlans,
    }
  }
}
