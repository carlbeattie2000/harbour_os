import { PortCallSchema } from '#database/schema'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import FeeEvent from './fee_event.ts'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Vessel from './vessel.ts'

export default class PortCall extends PortCallSchema {
  @hasMany(() => FeeEvent)
  declare feeEvents: HasMany<typeof FeeEvent>

  @belongsTo(() => Vessel, { foreignKey: 'vesselId', localKey: 'imoNumber' })
  declare vessel: BelongsTo<typeof Vessel>
}
