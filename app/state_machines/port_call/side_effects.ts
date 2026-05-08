import { NotificationService } from '#services/notification_service'
import type { TransactionClientContract } from '@adonisjs/lucid/types/database'
import { type PortCallOperationalPhase, type PortCallStatus } from '../../contracts/port_call.ts'
import type { Actor } from '../../contracts/actor.ts'

const notificationService = new NotificationService()

export async function handlePortCallStatusTransitionSideEffects(
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

export async function handlePortCallOperationalPhaseTransitionSideEffects(
  from: PortCallOperationalPhase,
  to: PortCallOperationalPhase,
  portCallId: number,
  accountId: number,
  actor: Actor,
  trx?: TransactionClientContract
) {
  void actor
  void trx
  void from
  void to
  void portCallId
  void accountId
}
