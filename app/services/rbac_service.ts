import Account from '#models/account'
import type Role from '#models/role'
import type User from '#models/user'
import type UserAccountRole from '#models/user_account_role'
import { type TransactionClientContract } from '@adonisjs/lucid/types/database'
import { DateTime } from 'luxon'

const WILDCARD_ROLE = '*'

export class RbacService {
  private static RoleHasExpired(role: Role | UserAccountRole) {
    const expiry = role.$extras.pivot_expires_at
      ? DateTime.fromSQL(role.$extras.pivot_expires_at)
      : null

    const isExpired = expiry && expiry <= DateTime.now()

    return isExpired
  }

  static HasRole(userRoles: string[], roles: string[], strict: boolean): boolean {
    userRoles = [...userRoles, WILDCARD_ROLE]
    return strict
      ? this.HasAllRoles(userRoles, roles)
      : roles.some((role) => userRoles.includes(role))
  }

  private static HasAllRoles(userRoles: string[], roles: string[]): boolean {
    return roles.every((role) => userRoles.includes(role))
  }

  static UserRolesToSlugs(roles: Role[] | UserAccountRole[]): string[] {
    const slugs = []

    for (const role of roles) {
      if (this.RoleHasExpired(role)) continue

      slugs.push(role.slug)
    }

    return slugs
  }

  static async getUserRoles(user: User, trx?: TransactionClientContract): Promise<string[]> {
    if (trx) {
      await user.useTransaction(trx).load('roles')
      return this.UserRolesToSlugs(user.roles)
    }
    await user.load('roles')
    return this.UserRolesToSlugs(user.roles);
  }

  static async getAccountRoles(user: User, account: Account, trx?: TransactionClientContract): Promise<string[]> {
    if (trx) {
      await user.useTransaction(trx).load('accountRoles', (query) => {
        query.where('account_id', account.id);
      })
      return this.UserRolesToSlugs(user.accountRoles)
    }
    await user.load('accountRoles', (query) => {
      query.where('account_id', account.id);
    })
    return this.UserRolesToSlugs(user.accountRoles)
  }

  static CanPerformAction(
    userRoles: string[],
    allowedRoles: string[],
    disallowedRoles: string[],
    allowedStrict: boolean
  ) {
    if (allowedRoles.length > 0 && !this.HasRole(userRoles, allowedRoles, allowedStrict))
      return false
    if (disallowedRoles.length > 0 && this.HasRole(userRoles, disallowedRoles, false)) return false
    return true
  }
}
