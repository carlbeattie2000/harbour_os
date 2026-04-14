import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { VesselService } from '#services/vessel_service'
import { queryPendingListValidator, validatePendingVesselValidator } from '#validators/vessel'

@inject()
export default class VesselsController {
  constructor(protected vesselService: VesselService) {}

  async pending({ view, request }: HttpContext) {
    const { qs } = await request.validateUsing(queryPendingListValidator)
    const pendingVesselsPaginator = await this.vesselService.queryPending(qs?.page ?? 1)
    const pendingVessels = pendingVesselsPaginator.serialize()

    return view.render('pages/internal/vessels/pending', {
      pendingVessels: pendingVessels.data,
      pendingVesselsMeta: pendingVessels.meta,
    })
  }

  async approve({ request, response, session }: HttpContext) {
    const { params } = await request.validateUsing(validatePendingVesselValidator)

    const flashMessage = await this.vesselService.approveVessel(params.id)

    session.flash('success', flashMessage)

    return response.redirect().toRoute('vessels.pending')
  }

  async deny({ request, response, session }: HttpContext) {
    const { params } = await request.validateUsing(validatePendingVesselValidator)

    const flashMessage = await this.vesselService.denyVessel(params.id)

    session.flash('error', flashMessage)

    return response.redirect().toRoute('vessels.pending')
  }
}
