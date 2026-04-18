import { ForbiddenError, NotFoundError } from '#errors/app_error'
import Berth from '#models/berth'
import BerthVisit from '#models/berth_visit'
import PortCall from '#models/port_call'
import type User from '#models/user'
import type Vessel from '#models/vessel'
import { PortCallPolicy } from '#policies/port_call_policy'
import type { DateTime } from 'luxon'

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
    return await PortCall.query()
      .whereNotIn('status', ['pending', 'awaiting_account_approval'])
      .andWhereNot('vesselId', excludeVesselId)
      .where((query) => {
        query.where('eta', '<', etd.toSQL()!).andWhere('etd', '>', eta.toSQL()!)
      })
      .preload('vessel', (query) => query.select('name').select('imoNumber'))
  }

  async setStatus(
    id: number,
    status: 'pending' | 'awaiting_account_approval' | 'approved' | 'denied',
    user: User
  ) {
    const portCall = await PortCall.find(id)
    if (!portCall) {
      throw new NotFoundError()
    }

    const canSetStatus = await PortCallPolicy.CanEditStatus(user, portCall)

    if (!canSetStatus) {
      throw new ForbiddenError()
    }

    await portCall.merge({ status }).save()
  }

  async assignBerth(portCallId: number, berthId: number) {
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
  }
}
