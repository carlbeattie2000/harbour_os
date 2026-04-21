import { StowagePlanSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import PortCall from './port_call.ts'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Container from './container.ts'

export default class StowagePlan extends StowagePlanSchema {
  @belongsTo(() => PortCall)
  declare portCall: BelongsTo<typeof PortCall>

  @belongsTo(() => Container)
  declare container: BelongsTo<typeof Container>
}
