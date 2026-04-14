import { PortCallSchema } from '#database/schema'
import { hasMany } from '@adonisjs/lucid/orm'
import FeeEvent from './fee_event.ts'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class PortCall extends PortCallSchema {
  @hasMany(() => FeeEvent)
  declare feeEvents: HasMany<typeof FeeEvent>
}
