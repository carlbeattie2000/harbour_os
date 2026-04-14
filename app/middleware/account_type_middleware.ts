import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { AccountType } from '../constants/account_types.ts'
import { ForbiddenError } from '../errors/app_error.ts'

export default class AccountTypeMiddleware {
  async handle(ctx: HttpContext, next: NextFn, accountType: AccountType | AccountType[]) {
    const account = ctx.account

    if (account.type !== accountType) {
      throw new ForbiddenError()
    }

    return await next()
  }
}
