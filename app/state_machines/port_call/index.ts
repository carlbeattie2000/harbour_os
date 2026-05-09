import { type TransactionClientContract } from '@adonisjs/lucid/types/database'
import {
  type PortCallWithVessel,
  type PortCallStatus,
  type PortCallOperationalPhase,
} from '../../contracts/port_call.ts'
import { assertValidTransition, isTransitionRedundant } from '../index.ts'
import { PORT_CALL_PHASE_TRANSITIONS, PORT_CALL_STATUS_TRANSITIONS } from './transitions.ts'
import { type Actor } from '../../contracts/actor.ts'
import {
  handlePortCallOperationalPhaseTransitionSideEffects,
  handlePortCallStatusTransitionSideEffects,
} from './side_effects.ts'
import db from '@adonisjs/lucid/services/db'
import { PortCallPolicy } from '#policies/port_call_policy'

export default class PortCallStateManager {
  public static async Transition(
    portCall: PortCallWithVessel,
    toStatus: PortCallStatus,
    toPhase: PortCallOperationalPhase,
    actor: Actor,
    trx?: TransactionClientContract
  ) {
    if (!trx) {
      await db.transaction(async (transaction) => {
        await this.TransitionStatus(portCall, toStatus, actor, transaction)
        await this.TransitionOperationalPhase(portCall, toPhase, actor, transaction)
      })
    }

    await this.TransitionStatus(portCall, toStatus, actor, trx)
    await this.TransitionOperationalPhase(portCall, toPhase, actor, trx)
  }

  public static async TransitionStatus(
    portCall: PortCallWithVessel,
    to: PortCallStatus,
    actor: Actor,
    trx?: TransactionClientContract
  ) {
    if (isTransitionRedundant(portCall.status, to)) {
      return
    }

    assertValidTransition(PORT_CALL_STATUS_TRANSITIONS, portCall.status, to)

    await PortCallPolicy.assertCanEditStatus(actor, portCall, trx)

    await handlePortCallStatusTransitionSideEffects(
      portCall.status,
      to,
      portCall.id,
      portCall.vessel.shippingLineId,
      actor,
      trx
    )

    if (trx) {
      portCall.useTransaction(trx)
    }

    await portCall.merge({ status: to }).save()
  }

  public static async TransitionOperationalPhase(
    portCall: PortCallWithVessel,
    to: PortCallOperationalPhase,
    actor: Actor,
    trx?: TransactionClientContract
  ) {
    if (isTransitionRedundant(portCall.operationalPhase, to)) {
      return
    }

    assertValidTransition(PORT_CALL_PHASE_TRANSITIONS, portCall.operationalPhase, to)

    await handlePortCallOperationalPhaseTransitionSideEffects(
      portCall.operationalPhase,
      to,
      portCall.id,
      portCall.vessel.shippingLineId,
      actor,
      trx
    )

    if (trx) {
      portCall.useTransaction(trx)
    }

    await portCall.merge({ operationalPhase: to }).save()
  }
}
