import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { PortCallService } from '#services/port_call_service'
import { getPortCallValidator } from '#validators/port_call'

@inject()
export default class PortCallsController {
  constructor(protected portCallService: PortCallService) {}

  async pending({ view }: HttpContext) {
    const nextPendingPortCall = await this.portCallService.findNextPending()
    const portCalls = nextPendingPortCall
      ? await this.portCallService.findOverlapping(
          nextPendingPortCall.vesselId,
          nextPendingPortCall.etd,
          nextPendingPortCall.eta
        )
      : []

    return view.render('pages/internal/port_calls/pending', {
      portCall: nextPendingPortCall,
      portCalls,
    })
  }

  async approve({ request, response, auth, session }: HttpContext) {
    const { params } = await request.validateUsing(getPortCallValidator)
    const user = auth.getUserOrFail()

    await this.portCallService.setStatus(params.id, 'approved', user)

    session.flash('success', 'Port call approved')

    return response.redirect().toRoute('port_calls.pending')
  }

  async deny({ request, response, auth, session }: HttpContext) {
    const { params } = await request.validateUsing(getPortCallValidator)
    const user = auth.getUserOrFail()

    await this.portCallService.setStatus(params.id, 'denied', user)

    session.flash('error', 'Port call denied')

    return response.redirect().toRoute('port_calls.pending')
  }
}
