import { CargoReleaseSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import Container from './container.ts'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Account from './account.ts'
import TruckVisit from './truck_visit.ts'

export default class CargoRelease extends CargoReleaseSchema {
  @belongsTo(() => Container)
  declare container: BelongsTo<typeof Container>

  @belongsTo(() => Account, {
    localKey: 'shipping_line_id',
  })
  declare shippingLine: BelongsTo<typeof Account>

  @belongsTo(() => TruckVisit)
  declare truckVisit: BelongsTo<typeof TruckVisit>
}
