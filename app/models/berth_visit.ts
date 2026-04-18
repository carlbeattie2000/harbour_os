import { BerthVisitSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import PortCall from './port_call.ts'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Berth from './berth.ts'

export default class BerthVisit extends BerthVisitSchema {
  @belongsTo(() => PortCall)
  declare portCall: BelongsTo<typeof PortCall>

  @belongsTo(() => Berth)
  declare berth: BelongsTo<typeof Berth>
}
