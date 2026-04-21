import { ContainerEventSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import Container from './container.ts'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import PortCall from './port_call.ts'
import TruckVisit from './truck_visit.ts'

export default class ContainerEvent extends ContainerEventSchema {
  @belongsTo(() => Container)
  declare container: BelongsTo<typeof Container>

  @belongsTo(() => PortCall)
  declare portCall: BelongsTo<typeof PortCall>

  @belongsTo(() => TruckVisit)
  declare truckVisit: BelongsTo<typeof TruckVisit>
}
