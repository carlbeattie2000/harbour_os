import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { VesselService } from '#services/vessel_service'
import { queryPendingListValidator } from '#validators/vessel'

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

  async completeVerification() {}
}
