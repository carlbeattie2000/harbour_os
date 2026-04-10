import { AccountSchema } from '#database/schema'
import { hasMany, manyToMany } from '@adonisjs/lucid/orm'
import User from './user.ts'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import UserAccountRole from './user_account_role.ts'

export default class Account extends AccountSchema {
  @hasMany(() => UserAccountRole)
  declare roles: HasMany<typeof UserAccountRole>

  @manyToMany(() => User, {
    pivotTable: 'account_users',
    pivotForeignKey: 'account_id',
    pivotRelatedForeignKey: 'user_id',
  })
  declare users: ManyToMany<typeof User>
}
