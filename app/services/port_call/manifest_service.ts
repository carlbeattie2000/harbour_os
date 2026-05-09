import { type BaplieContainer } from '#domain/baplie/index'
import MathExtended from '#utils/math'
import { type TransactionClientContract } from '@adonisjs/lucid/types/database'
import { PortCallWithVessel } from '../../contracts/port_call.ts'
import { PortCallService } from '#services/port_call_service'
import { inject } from '@adonisjs/core'
import { Actor } from '../../contracts/actor.ts'

const INCREASE_BY_FLAG = 15

type HandleUpdateFromStowagePlansResult = { status: 'success' } | { status: 'flagged' }

@inject()
export class ManifestService {
  constructor(protected portCallService: PortCallService) {}
  async #handleIncreaseFlag(
    portCall: PortCallWithVessel,
    actor: Actor,
    trx?: TransactionClientContract
  ) {
    await this.portCallService.transitionStatusOnPortCall(portCall, 'under_review', actor, trx)
  }

  async handleUpdateFromStowagePlans(
    portCall: PortCallWithVessel,
    containers: BaplieContainer[],
    actor: Actor,
    trx: TransactionClientContract
  ): Promise<HandleUpdateFromStowagePlansResult> {
    await portCall.useTransaction(trx).load('manifest')
    const manifest = portCall.manifest

    let standard = 0
    let reefer = 0
    let hazmat = 0

    for (const container of containers) {
      if (container.reefer.temperature && container.hazmat.class) {
        reefer += 1
        hazmat += 1
      } else if (container.reefer.temperature) {
        reefer += 1
      } else if (container.hazmat.class) {
        hazmat += 1
      } else {
        standard += 1
      }
    }

    const standardChangePercent = MathExtended.percentageChange(
      manifest.estimatedUnloadStandard,
      standard
    )
    const reeferChangePercent = MathExtended.percentageChange(
      manifest.estimatedUnloadReefer,
      reefer
    )
    const hazmatChangePercent = MathExtended.percentageChange(
      manifest.estimatedUnloadHazmat,
      hazmat
    )

    const flagAsNeedingReview =
      standardChangePercent >= INCREASE_BY_FLAG ||
      reeferChangePercent >= INCREASE_BY_FLAG ||
      hazmatChangePercent >= INCREASE_BY_FLAG

    if (flagAsNeedingReview) {
      await this.#handleIncreaseFlag(portCall, actor, trx)
    }

    manifest.estimatedUnloadStandard = standard
    manifest.estimatedUnloadReefer = reefer
    manifest.estimatedUnloadHazmat = hazmat

    await manifest.useTransaction(trx).save()

    return flagAsNeedingReview ? { status: 'flagged' } : { status: 'success' }
  }
}
