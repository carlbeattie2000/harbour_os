import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class ShareViewDataMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    if (ctx.auth.user) {
      ctx.view.share({
        user: ctx.auth.user,
      })
    }
    return await next()
  }
}

