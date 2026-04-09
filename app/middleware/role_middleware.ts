import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { ForbiddenError } from '../errors/app_error.ts'
import { RbacService } from '#services/rbac_service'

export default class RoleMiddleware {
  async handle(
    ctx: HttpContext,
    next: NextFn,
    allowedRoles: string | string[],
    disallowedRoles: string | string[] = [],
    strictModeForAllowedRoles: boolean = false
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
        strictModeForAllowedRoles
      )
    ) {
      throw new ForbiddenError()
    }

    return await next()
  }
}
