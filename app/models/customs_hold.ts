import { CustomsHoldSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import Container from './container.ts'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class CustomsHold extends CustomsHoldSchema {
  @belongsTo(() => Container)
  declare container: BelongsTo<typeof Container>
}
