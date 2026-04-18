import { CraneSchema } from '#database/schema'
import { belongsTo, manyToMany } from '@adonisjs/lucid/orm'
import Berth from './berth.ts'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'

export default class Crane extends CraneSchema {
  @belongsTo(() => Berth)
  declare berth?: BelongsTo<typeof Berth>

  @manyToMany(() => Berth, {
    pivotTable: 'berth_available_cranes',
    pivotForeignKey: 'berth_id',
    pivotRelatedForeignKey: 'crane_id',
  })
  declare availableCranes: ManyToMany<typeof Berth>
}
