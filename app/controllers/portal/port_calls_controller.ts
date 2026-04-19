import { AccountDoesNotOwnVessel } from '#errors/port_call_errors'
import PortCall from '#models/port_call'
import Vessel from '#models/vessel'
import { createPortCallValidator } from '#validators/port_call'
import type { HttpContext } from '@adonisjs/core/http'

export default class PortCallsController {
  async create({ view, account }: HttpContext) {
    const vessels = await Vessel.query()
      .where('shippingLineId', account.id)
      .select('imoNumber', 'name')

    return view.render('pages/portal/port_calls/create', { account, vessels })
  }

  async store({ request, response, session, account }: HttpContext) {
    const payload = await request.validateUsing(createPortCallValidator)

    const vessel = await Vessel.query()
      .where('imoNumber', payload.imoNumber)
      .andWhere('shippingLineId', account.id)
      .first()

    if (!vessel) {
      throw new AccountDoesNotOwnVessel()
    }

    await PortCall.create({
      vesselId: vessel.imoNumber,
      eta: payload.eta,
      etd: payload.etd,
      pilotageRequired: payload.pilotageRequired,
      purpose: payload.purpose,
      estimatedDischargeContainers: payload.estimatedDischargeContainers,
      estimatedLoadContainers: payload.estimatedLoadContainers,
      voyageNumber: payload.voyageNumber,
      handlingTimeEstimatedHours: 0,
    })

    session.flash('success', 'Port call requested')

    return response.redirect().toRoute('port_calls.create', { id: account.id })
  }
}
