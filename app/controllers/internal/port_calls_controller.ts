import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'

import { approvePortCall, getPortCallValidator } from '#validators/port_call'

import { YardForecastService } from '#services/yard_forecast_service'
import { PortCallService } from '#services/port_call_service'

@inject()
export default class PortCallsController {
  constructor(
    protected portCallService: PortCallService,
    protected yardForecastService: YardForecastService
  ) {}

  async pending({ view }: HttpContext) {
    const nextPendingPortCall = await this.portCallService.findNextPending()
    await nextPendingPortCall?.load('manifest')

    const availableBerths = nextPendingPortCall
      ? await this.portCallService.findBerthConflicts(
          nextPendingPortCall.vessel,
          nextPendingPortCall.eta,
          nextPendingPortCall.etd
        )
      : []

    console.log('Available berths for next pending port call:', availableBerths)

    const conflicts = nextPendingPortCall
      ? await this.yardForecastService.checkPortCallCapacityFeasibility(
          nextPendingPortCall.eta,
          nextPendingPortCall.etd,
          nextPendingPortCall.manifest.estimatedUnload,
          nextPendingPortCall.manifest.estimatedLoad
        )
      : ''

    return view.render('pages/internal/port_calls/pending', {
      portCall: nextPendingPortCall,
      berths: availableBerths,
      conflicts,
    })
  }

  async approve({ request, response, auth, session }: HttpContext) {
    const { params, berthId, craneIds } = await request.validateUsing(approvePortCall)
    const user = auth.getUserOrFail()

    await this.portCallService.setStatus(params.id, 'scheduled', user)
    const berthVisit = await this.portCallService.assignBerth(params.id, berthId)
    await this.portCallService.assignCranesToBerthVisit(craneIds, berthVisit.id)

    session.flash('success', 'Port call approved')

    return response.redirect().toRoute('port_calls.pending')
  }

  async deny({ request, response, auth, session }: HttpContext) {
    const { params } = await request.validateUsing(getPortCallValidator)
    const user = auth.getUserOrFail()

    await this.portCallService.setStatus(params.id, 'unable_to_accept', user)

    session.flash('error', 'Port call denied')

    return response.redirect().toRoute('port_calls.pending')
  }
}
