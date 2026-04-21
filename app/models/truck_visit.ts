import { TruckVisitSchema } from '#database/schema'
import { hasMany } from '@adonisjs/lucid/orm'
import CargoRelease from './cargo_release.ts'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import ContainerEvent from './container_event.ts'

export default class TruckVisit extends TruckVisitSchema {
  @hasMany(() => CargoRelease)
  declare cargoReleases: HasMany<typeof CargoRelease>

  @hasMany(() => ContainerEvent)
  declare containerEvents: HasMany<typeof ContainerEvent>
}
