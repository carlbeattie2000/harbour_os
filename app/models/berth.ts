import { BerthSchema } from '#database/schema'
import { hasMany, manyToMany } from '@adonisjs/lucid/orm'
import Crane from './crane.ts'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import BerthVisit from './berth_visit.ts'

export default class Berth extends BerthSchema {
  @hasMany(() => Crane)
  declare cranes: HasMany<typeof Crane>

  @manyToMany(() => Crane, {
    pivotTable: 'berth_available_cranes',
    pivotForeignKey: 'crane_id',
    pivotRelatedForeignKey: 'berth_id',
  })
  declare availableCranes: ManyToMany<typeof Crane>

  @hasMany(() => BerthVisit)
  declare visits: HasMany<typeof BerthVisit>
}
