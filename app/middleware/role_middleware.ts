import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { Forbidden } from '../errors/app_error.ts'
import { DateTime } from 'luxon'
import type Role from '#models/role'

function roleIsValid(role: Role, roles: string[]) {
  const isCorrectRole = roles.includes(role.slug)

  const expiry = role.$extras.pivot_expires_at
    ? DateTime.fromSQL(role.$extras.pivot_expires_at)
    : null

  const isNotExpired = !expiry || expiry > DateTime.now()

  return isCorrectRole && isNotExpired
}

export default class RoleMiddleware {
  async handle(
    ctx: HttpContext,
    next: NextFn,
    requiredRole: string | string[],
    strict: boolean = false
  ) {
    const user = ctx.auth.getUserOrFail()

    const rolesToVerify = Array.isArray(requiredRole) ? requiredRole : [requiredRole]

    await user.load('roles')

    const hasValidRole = strict
      ? rolesToVerify.every((requiredSlug) => {
          return user.roles.some((userRole) => roleIsValid(userRole, [requiredSlug]))
        })
      : user.roles.some((role) => {
          return roleIsValid(role, rolesToVerify)
        })

    if (!hasValidRole) {
      throw new Forbidden()
    }

    return await next()
  }
}
