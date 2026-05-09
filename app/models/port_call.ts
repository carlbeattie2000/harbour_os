import { PortCallSchema } from '#database/schema'
import { belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import FeeEvent from './fee_event.ts'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Vessel from './vessel.ts'
import type { PortCallOperationalPhase, PortCallStatus } from '../contracts/port_call.ts'
import PortCallManifest from './port_call_manifest.ts'

export default class PortCall extends PortCallSchema {
  /**
   * DO NOT set status or operationalPhase directly.
   * Always use PortCallStateManager.Transition() or PortCallStateManager.TransitionStatus()
   * Direct assignment bypasses policy checks, side effects and audit logging.
   */
  @column()
  declare status: PortCallStatus

  /**
   * DO NOT set status or operationalPhase directly.
   * Always use PortCallStateManager.Transition() or PortCallStateManager.TransitionOperationalPhase()
   * Direct assignment bypasses policy checks, side effects and audit logging.
   */
  @column()
  declare operationalPhase: PortCallOperationalPhase

  @hasMany(() => FeeEvent)
  declare feeEvents: HasMany<typeof FeeEvent>

  @belongsTo(() => Vessel, { foreignKey: 'vesselId', localKey: 'imoNumber' })
  declare vessel: BelongsTo<typeof Vessel>

  @belongsTo(() => PortCallManifest)
  declare manifest: BelongsTo<typeof PortCallManifest>
}
