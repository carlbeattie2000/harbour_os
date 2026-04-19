import { createVesselValidator } from '#validators/vessel'
import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { VesselService } from '#services/vessel_service'
import { NotificationService } from '#services/notification_service'

@inject()
export default class VesselsController {
  constructor(
    protected vesselService: VesselService,
    protected notificationService: NotificationService
  ) {}

  async create({ view, account }: HttpContext) {
    return view.render('pages/portal/create_vessel', { account })
  }

  async store({ request, response, account, session }: HttpContext) {
    const payload = await request.validateUsing(createVesselValidator)

    const vessel = await this.vesselService.create(payload, {
      approved: false,
      accountId: account.id,
    })

    await this.notificationService.newVesselRequest(vessel.imoNumber)

    session.flash('success', 'Vessel is pending for verification!')

    return response.redirect().toRoute('vessels.create', { id: account.id })
  }
}
