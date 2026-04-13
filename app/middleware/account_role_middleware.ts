import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { ForbiddenError } from '../errors/app_error.ts'
import logger from '@adonisjs/core/services/logger'
import { RbacService } from '#services/rbac_service'
import { type AccountRoles } from '../contracts/roles.ts'
import { DateTime } from 'luxon'

interface AccountRoleMiddlewareConfig {
  allowedRoles?: AccountRoles | AccountRoles[]
  disallowedRoles?: AccountRoles | AccountRoles[]
  strictMode?: boolean
}

export default class AccountRoleMiddleware {
  async handle(
    ctx: HttpContext,
    next: NextFn,
    { allowedRoles = [], disallowedRoles = [], strictMode = false }: AccountRoleMiddlewareConfig
  ) {
    const user = ctx.auth.getUserOrFail()

    const allowedRolesToVerify = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]

    const disallowedRolesToVerify = Array.isArray(disallowedRoles)
      ? disallowedRoles
      : [disallowedRoles]

    const accountRoles = await RbacService.getAccountRoles(user, ctx.account)

    if (
      !RbacService.CanPerformAction(
        accountRoles,
        allowedRolesToVerify,
        disallowedRolesToVerify,
        strictMode
      )
    ) {
      logger.error(
        `[${DateTime.now().toFormat('dd-MM-yyyy hh:mm:ss')}] DENIED - User ${user.firstName} (${user.id}) | Roles: ${accountRoles.join(', ')} | Route: ${ctx.request.url()} | Method: ${ctx.request.method()}`
      )
      throw new ForbiddenError()
    }

    return await next()
  }
}
