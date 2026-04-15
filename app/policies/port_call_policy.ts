import type PortCall from '#models/port_call'
import type User from '#models/user'
import { RbacService } from '#services/rbac_service'

export class PortCallPolicy {
  static async CanEditStatus(user: User, portCall: PortCall): Promise<boolean> {
    const adminRequiredStatus = ['denied', 'approved', 'completed', 'canceled']
    if (adminRequiredStatus.includes(portCall.status)) {
      const userRoles = await RbacService.getUserRoles(user)
      return RbacService.HasRole(userRoles, ['admin'], false)
    }

    if (portCall.status === 'awaiting_account_approval') {
      const userRoles = await RbacService.getUserRoles(user)
      return RbacService.HasRole(userRoles, ['portal', 'admin'], false)
    }

    return true
  }
}
