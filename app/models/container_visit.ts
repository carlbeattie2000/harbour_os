import { ContainerVisitSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import Container from './container.ts'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import PortCall from './port_call.ts'
import YardSlot from './yard_slot.ts'

export default class ContainerVisit extends ContainerVisitSchema {
  @belongsTo(() => Container)
  declare container: BelongsTo<typeof Container>

  @belongsTo(() => PortCall, {
    foreignKey: 'port_call_inbound_id',
  })
  declare portCallInbound: BelongsTo<typeof PortCall>

  @belongsTo(() => PortCall, {
    foreignKey: 'port_call_outbound_id',
  })
  declare portCallOutbound: BelongsTo<typeof PortCall>

  @belongsTo(() => YardSlot)
  declare yardSlot: BelongsTo<typeof YardSlot>
}
