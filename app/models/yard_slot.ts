import { YardSlotSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import Account from './account.ts'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class YardSlot extends YardSlotSchema {
  @belongsTo(() => Account, {
    foreignKey: 'owningAccountId',
  })
  declare account?: BelongsTo<typeof Account>
}
