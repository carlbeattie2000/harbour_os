import User from '#models/user'
import transmit from '@adonisjs/transmit/services/main'
import { DateTime } from 'luxon'

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

  private async getUsersWithRoles(...roles: string[]): Promise<number[]> {
    const users = await User.query()
      .whereHas('roles', (query) => {
        query.whereIn('slug', roles)
      })
      .select('id')

    return users.map((u) => u.id)
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
}
