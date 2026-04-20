import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { ForbiddenError } from '../errors/app_error.ts'
import { RbacService } from '#services/rbac_service'
import logger from '@adonisjs/core/services/logger'
import { DateTime } from 'luxon'
import type { UserRoles } from '../contracts/roles.ts'

interface RoleMiddlewareConfig {
  allowedRoles?: UserRoles | UserRoles[]
  disallowedRoles?: UserRoles | UserRoles[]
  strictMode?: boolean
}

export default class RoleMiddleware {
  async handle(
    ctx: HttpContext,
    next: NextFn,
    { allowedRoles = [], disallowedRoles = [], strictMode = false }: RoleMiddlewareConfig
  ) {
    const user = ctx.auth.getUserOrFail()

    const allowedRolesToVerify = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]

    const disallowedRolesToVerify = Array.isArray(disallowedRoles)
      ? disallowedRoles
      : [disallowedRoles]

    const usersRoles = await RbacService.getUserRoles(user)

    if (
      !RbacService.CanPerformAction(
        usersRoles,
        allowedRolesToVerify,
        disallowedRolesToVerify,
        strictMode
      )
    ) {
      logger.error(
        `[${DateTime.now().toFormat('dd-MM-yyyy hh:mm:ss')}] DENIED - User ${user.firstName} (${user.id}) | Roles: ${usersRoles.join(', ')} | Route: ${ctx.request.url()} | Method: ${ctx.request.method()}`
      )
      throw new ForbiddenError()
    }

    return await next()
  }
}
