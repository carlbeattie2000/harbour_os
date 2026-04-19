import { BerthVisitSchema } from '#database/schema'
import { belongsTo, manyToMany } from '@adonisjs/lucid/orm'
import PortCall from './port_call.ts'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import Berth from './berth.ts'
import Crane from './crane.ts'

export default class BerthVisit extends BerthVisitSchema {
  @belongsTo(() => PortCall)
  declare portCall: BelongsTo<typeof PortCall>

  @belongsTo(() => Berth)
  declare berth: BelongsTo<typeof Berth>

  @manyToMany(() => Crane, {
    pivotTable: 'crane_berth_assignments',
    pivotForeignKey: 'berth_visit_id',
    pivotRelatedForeignKey: 'crane_id',
  })
  declare cranes: ManyToMany<typeof Crane>
}
