import { ForbiddenError } from '#errors/app_error'
import type PortCall from '#models/port_call'
import { RbacService } from '#services/rbac_service'
import { type TransactionClientContract } from '@adonisjs/lucid/types/database'
import { type Actor } from '../contracts/actor.ts'
import type { PortCallStatus } from '../contracts/port_call.ts'

export class PortCallPolicy {
  static async CanEditStatus(
    actor: Actor,
    portCall: PortCall,
    trx?: TransactionClientContract
  ): Promise<boolean> {
    if (actor === 'system') {
      return true
    }

    const userRoles = await RbacService.getUserRoles(actor, trx)

    const adminRequiredStatus: PortCallStatus[] = ['approved', 'canceled']
    if (adminRequiredStatus.includes(portCall.status)) {
      return RbacService.HasRole(userRoles, ['admin'], false)
    }

    if (portCall.status === 'awaiting_account_approval') {
      return RbacService.HasRole(userRoles, ['portal', 'admin'], false)
    }

    return true
  }

  static async assertCanEditStatus(
    actor: Actor,
    portCall: PortCall,
    trx?: TransactionClientContract
  ): Promise<void> {
    const canEditStatus = await this.CanEditStatus(actor, portCall, trx)

    if (!canEditStatus) {
      throw new ForbiddenError()
    }
  }
}
