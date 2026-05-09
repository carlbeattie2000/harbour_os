import Berth from '#models/berth'
import BerthVisit from '#models/berth_visit'
import CraneBerthAssignment from '#models/crane_berth_assignment'
import PortCall from '#models/port_call'

import type User from '#models/user'
import type Vessel from '#models/vessel'
import type { DateTime } from 'luxon'
import type {
  PortCallOperationalPhase,
  PortCallStatus,
  PortCallWithVessel,
} from '../contracts/port_call.ts'

import { PortCallNotFound } from '#errors/port_call_errors'
import logger from '@adonisjs/core/services/logger'
import { type TransactionClientContract } from '@adonisjs/lucid/types/database'
import PortCallStateManager from '../state_machines/port_call/index.ts'
import type { Actor } from '../contracts/actor.ts'

export class PortCallService {
  async findNextPending() {
    return await PortCall.query()
      .where('status', 'pending')
      .preload('vessel', (query) => {
        query.preload('account', (vesselQuery) => {
          vesselQuery.select('companyName')
        })
      })
      .first()
  }

  async findOverlapping(excludeVesselId: string, etd: DateTime, eta: DateTime) {
    const ignoreStatuses: PortCallStatus[] = ['pending', 'awaiting_account_approval', 'canceled']
    return await PortCall.query()
      .whereNotIn('status', ignoreStatuses)
      .andWhereNot('vesselId', excludeVesselId)
      .where((query) => {
        query.where('eta', '<', etd.toSQL()!).andWhere('etd', '>', eta.toSQL()!)
      })
      .preload('vessel', (query) => query.select('name').select('imoNumber'))
  }

  async transition(
    id: number,
    status: PortCallStatus,
    phase: PortCallOperationalPhase,
    user: User,
    trx?: TransactionClientContract
  ) {
    const portCall = await this.findWithVessel(id)
    await PortCallStateManager.Transition(portCall, status, phase, user, trx)
  }

  async transitionOnPortCall(
    portCall: PortCallWithVessel,
    status: PortCallStatus,
    phase: PortCallOperationalPhase,
    user: User,
    trx?: TransactionClientContract
  ) {
    await PortCallStateManager.Transition(portCall, status, phase, user, trx)
  }

  async transitionStatus(
    id: number,
    status: PortCallStatus,
    user: User,
    trx?: TransactionClientContract
  ) {
    const portCall = await this.findWithVessel(id)
    await PortCallStateManager.TransitionStatus(portCall, status, user, trx)
  }

  async transitionOperationalPhase(
    id: number,
    phase: PortCallOperationalPhase,
    user: User,
    trx?: TransactionClientContract
  ) {
    const portCall = await this.findWithVessel(id)
    await PortCallStateManager.TransitionOperationalPhase(portCall, phase, user, trx)
  }

  async transitionStatusOnPortCall(
    portCall: PortCallWithVessel,
    status: PortCallStatus,
    user: Actor,
    trx?: TransactionClientContract
  ) {
    await PortCallStateManager.TransitionStatus(portCall, status, user, trx)
  }

  async transitionOperationalPhaseOnPortCall(
    portCall: PortCallWithVessel,
    phase: PortCallOperationalPhase,
    user: Actor,
    trx?: TransactionClientContract
  ) {
    await PortCallStateManager.TransitionOperationalPhase(portCall, phase, user, trx)
  }

  async assignBerth(portCallId: number, berthId: number): Promise<BerthVisit> {
    const portCall = await PortCall.query().where('id', portCallId).firstOrFail()

    return await BerthVisit.create({
      portCallId: portCall.id,
      berthId: berthId,
      plannedArrival: portCall.eta,
      plannedDeparture: portCall.etd,
      purpose: portCall.purpose,
      status: 'planned',
    })
  }

  async findBerthConflicts(
    vessel: Vessel,
    estimatedArrival: DateTime,
    estimatedDeparture: DateTime
  ) {
    return await Berth.query()
      .where('length', '>=', vessel.loa)
      .andWhere('maxDraft', '>=', vessel.maxDraft)
      .andWhere('maxBeam', '>=', vessel.beam)
      .preload('visits', (query) => {
        query
          .where('plannedArrival', '<', estimatedDeparture.toSQL()!)
          .andWhere('plannedDeparture', '>', estimatedArrival.toSQL()!)
      })
      .preload('availableCranes', (query) => {
        query.whereDoesntHave('berthVisits', (visitQuery) => {
          visitQuery
            .where('plannedArrival', '<', estimatedDeparture.toSQL()!)
            .andWhere('plannedDeparture', '>', estimatedArrival.toSQL()!)
        })
      })
  }

  async assignCranesToBerthVisit(craneIds: number[], berthVisitId: number) {
    const assignedCranes = craneIds.map((id) => ({
      craneId: id,
      berthVisitId: berthVisitId,
    }))

    await CraneBerthAssignment.createMany(assignedCranes)
  }

  async findWithVessel(id: number): Promise<PortCallWithVessel> {
    const portCall = await PortCall.query().where('id', id).preload('vessel').first()

    if (!portCall) {
      throw new PortCallNotFound()
    }

    if (!portCall.vessel.shippingLineId) {
      logger.error(`Port call ${portCall.id} has vessel with no shipping line owner`)
      throw new PortCallNotFound()
    }

    return portCall as PortCallWithVessel
  }

  async findByVoyageNumberWithVessel(voyageNumber: string): Promise<PortCallWithVessel> {
    const portCall = await PortCall.query()
      .where('voyageNumber', voyageNumber)
      .preload('vessel')
      .first()

    if (!portCall) {
      throw new PortCallNotFound()
    }

    if (!portCall.vessel.shippingLineId) {
      logger.error(`Port call ${portCall.id} has vessel with no shipping line owner`)
      throw new PortCallNotFound()
    }

    return portCall as PortCallWithVessel
  }
}
