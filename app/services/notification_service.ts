import User from '#models/user'
import transmit from '@adonisjs/transmit/services/main'
import { DateTime } from 'luxon'
import { type UserRoles, type AccountRoles } from '../contracts/roles.ts'
import Account from '#models/account'
import { type PortCallStatus } from '../contracts/port_call.ts'

export class NotificationService {
  private channel = (id: number) => `notifications/users/${id}`

  private async broadcast(userIds: number[], payload: Record<string, unknown>) {
    for (const id of userIds) {
      transmit.broadcast(this.channel(id), {
        ...payload,
        sentAt: DateTime.now(),
      } as any)
    }
  }

  private async getUsersWithRoles(...roles: UserRoles[]): Promise<number[]> {
    const users = await User.query()
      .whereHas('roles', (query) => {
        query.whereIn('slug', roles)
      })
      .select('id')

    return users.map((u) => u.id)
  }

  async getUsersWithRoleOnAccount(accountId: number, ...roles: AccountRoles[]): Promise<number[]> {
    const account = await Account.query()
      .where('id', accountId)
      .preload('users', (query) => {
        query.whereHas('accountRoles', (accountRoleQuery) => {
          accountRoleQuery.whereIn('slug', roles)
        })
        query.select('id')
      })
      .first()
    return account?.users.map((u) => u.id) ?? []
  }

  async portCallRequested(portCallId: number) {
    const userIds = await this.getUsersWithRoles('admin')
    await this.broadcast(userIds, {
      type: 'port_call_requested',
      message: 'New port call has been requested',
      portCallId,
    })
  }

  async newVesselRequest(vesselId: string) {
    const userIds = await this.getUsersWithRoles('admin')
    await this.broadcast(userIds, {
      type: 'vessel_requested',
      message: 'New vessel request',
      vesselId,
    })
  }

  async portCallStatusChange(
    accountId: number,
    portCallId: number,
    from: PortCallStatus,
    to: PortCallStatus
  ) {
    const internalUserIds = await this.getUsersWithRoles(
      'admin',
      'operations_manager',
      'yard_manager'
    )
    const accountUserIds = await this.getUsersWithRoleOnAccount(
      accountId,
      'account_admin',
      'vessel_planner'
    )
    await this.broadcast([...internalUserIds, ...accountUserIds], {
      type: 'port_call_status_changed',
      message: `Port call has changed status from ${from} to ${to}`,
      portCallId,
    })
  }
}
