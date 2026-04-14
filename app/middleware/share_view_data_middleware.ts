import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class ShareViewDataMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    if (ctx.auth.user) {
      await ctx.auth.user.load('roles');
      await ctx.auth.user.load('accountRoles');

      ctx.view.share({
        user: ctx.auth.user,
      })
    }
    return await next()
  }
}

