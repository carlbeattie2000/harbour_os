import type PortCall from '#models/port_call'
import { RbacService } from '#services/rbac_service'
import { type Actor } from '../contracts/actor.ts'

export class PortCallPolicy {
  static async CanEditStatus(actor: Actor, portCall: PortCall): Promise<boolean> {
    if (actor === 'system') {
      return true
    }

    const adminRequiredStatus = ['denied', 'approved', 'completed', 'canceled']
    if (adminRequiredStatus.includes(portCall.status)) {
      const userRoles = await RbacService.getUserRoles(actor)
      return RbacService.HasRole(userRoles, ['admin'], false)
    }

    if (portCall.status === 'awaiting_account_approval') {
      const userRoles = await RbacService.getUserRoles(actor)
      return RbacService.HasRole(userRoles, ['portal', 'admin'], false)
    }

    return true
  }
}
