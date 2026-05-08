import type PortCall from '#models/port_call'
import { type TransactionClientContract } from '@adonisjs/lucid/types/database'
import { type PortCallStatus } from '../../contracts/port_call.ts'
import { assertValidTransition } from '../index.ts'
import handlePortCallSideEffects from './side_effects.ts'
import { PORT_CALL_TRANSITIONS } from './transitions.ts'
import { type Actor } from '../../contracts/actor.ts'

export default class PortCallStateManager {
  public static async Transition(
    portCall: PortCall,
    to: PortCallStatus,
    accountId: number,
    actor: Actor,
    trx?: TransactionClientContract
  ) {
    assertValidTransition(PORT_CALL_TRANSITIONS, portCall.status, to)

    await handlePortCallSideEffects(portCall.status, to, portCall.id, accountId, actor, trx)

    portCall.status = to

    if (trx) {
      portCall.useTransaction(trx)
    }

    await portCall.save()
  }
}
