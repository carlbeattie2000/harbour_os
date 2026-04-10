import Account from '#models/account'
import { accountIdParamValidator } from '#validators/account'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { NotFoundError } from '../errors/app_error.ts'
import logger from '@adonisjs/core/services/logger'
import { DateTime } from 'luxon'

declare module '@adonisjs/core/http' {
  interface HttpContext {
    account: Account
  }
}

export default class AccountMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const { params } = await ctx.request.validateUsing(accountIdParamValidator)
    const user = ctx.auth.getUserOrFail()

    const account = await Account.query()
      .where('id', params.id)
      .whereHas('users', (query) => {
        query.where('user_id', user.id)
      })
      .first()

    if (!account) {
      logger.error(
        `[${DateTime.now().toFormat('dd-MM-yyyy hh:mm:ss')}] DENIED FROM ACCOUNT - User ${user.firstName} (${user.id}) | Account: ${params.id}`
      )
      throw new NotFoundError()
    }

    ctx.account = account

    return await next()
  }
}
