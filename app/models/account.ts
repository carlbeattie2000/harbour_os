import { AccountSchema } from '#database/schema'
import { manyToMany } from '@adonisjs/lucid/orm'
import User from './user.ts'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'

export default class Account extends AccountSchema {
  @manyToMany(() => User, {
    pivotTable: 'account_users',
    pivotForeignKey: 'account_id',
    pivotRelatedForeignKey: 'user_id',
  })
  declare users: ManyToMany<typeof User>
}
