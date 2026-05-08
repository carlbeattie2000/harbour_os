import { UploadService } from '#services/domain/baplie/upload_service'
import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import {
  confirmBaplieUploadValidator,
  createBaplieUploadValidator,
  viewStowagePlanByVesselNumber,
} from '#validators/baplie'

@inject()
export default class BapliesController {
  constructor(protected baplieUploadService: UploadService) {}

  async create({ view }: HttpContext) {
    return view.render('pages/internal/baplie/baplie_upload')
  }

  async store({ request, view, session, response, auth }: HttpContext) {
    const user = auth.getUserOrFail()
    const { content } = await request.validateUsing(createBaplieUploadValidator)

    const result = await this.baplieUploadService.handleBaplieUpload(content, {
      shippingLineId: null,
      actor: user,
    })

    if (result.status === 'conflict') {
      return view.render('pages/internal/baplie/baplie_diff', {
        added: result.diff.added,
        removed: result.diff.removed,
        cacheId: result.cacheId,
      })
    }

    if (result.status === 'success') {
      session.flash('success', 'baplie uploaded')
      return response.redirect().toRoute('baplies.view', { voyageNumber: result.voyageNumber })
    }

    session.flash('error', result.reason)
    return response.redirect().toRoute('baplies.create')
  }

  async confirm({ request, session, response, auth }: HttpContext) {
    const user = auth.getUserOrFail()
    const { cacheId } = await request.validateUsing(confirmBaplieUploadValidator)

    const result = await this.baplieUploadService.handleBaplieMerge(cacheId, {
      shippingLineId: null,
      actor: user,
    })

    if (result.status === 'success') {
      session.flash('success', 'baplie merged')
      return response.redirect().toRoute('baplies.view', { voyageNumber: result.voyageNumber })
    }

    session.flash('error', result.reason)
    return response.redirect().toRoute('baplies.create')
  }

  async cancel({ request, response, session }: HttpContext) {
    const { cacheId } = await request.validateUsing(confirmBaplieUploadValidator)

    this.baplieUploadService.deleteBaplieFromCache(cacheId)

    session.flash('error', 'canceled baplie merge')
    return response.redirect().toRoute('baplies.create')
  }

  async find({ view }: HttpContext) {
    return view.render('pages/internal/baplie/baplie_find')
  }

  async view({ request, view }: HttpContext) {
    const {
      params: { voyageNumber },
    } = await request.validateUsing(viewStowagePlanByVesselNumber)

    const result = await this.baplieUploadService.getStowagePlansForVoyage(voyageNumber, {
      shippingLineId: null,
    })

    return view.render('pages/internal/baplie/baplie_view', {
      portCall: result.portCall,
      stowagePlans: result.stowagePlans,
    })
  }
}
