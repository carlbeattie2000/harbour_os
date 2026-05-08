import { NotificationService } from '#services/notification_service'
import type { TransactionClientContract } from '@adonisjs/lucid/types/database'
import { type PortCallStatus } from '../../contracts/port_call.ts'
import type { Actor } from '../../contracts/actor.ts'

const notificationService = new NotificationService()

export default async function handlePortCallSideEffects(
  from: PortCallStatus,
  to: PortCallStatus,
  portCallId: number,
  accountId: number,
  actor: Actor,
  trx?: TransactionClientContract
) {
  void actor
  void trx

  await notificationService.portCallStatusChange(accountId, portCallId, from, to)
}
