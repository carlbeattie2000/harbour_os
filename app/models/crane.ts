import { CraneSchema } from '#database/schema'
import { belongsTo, manyToMany } from '@adonisjs/lucid/orm'
import Berth from './berth.ts'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import BerthVisit from './berth_visit.ts'

export default class Crane extends CraneSchema {
  @belongsTo(() => Berth)
  declare berth?: BelongsTo<typeof Berth>

  @manyToMany(() => Berth, {
    pivotTable: 'berth_available_cranes',
    pivotForeignKey: 'crane_id',
    pivotRelatedForeignKey: 'berth_id',
  })
  declare availableCranes: ManyToMany<typeof Berth>

  @manyToMany(() => BerthVisit, {
    pivotTable: 'crane_berth_assignments',
    pivotForeignKey: 'crane_id',
    pivotRelatedForeignKey: 'berth_visit_id',
  })
  declare berthVisits: ManyToMany<typeof BerthVisit>
}
