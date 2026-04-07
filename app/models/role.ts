import { RoleSchema } from '#database/schema'
import { manyToMany } from '@adonisjs/lucid/orm'
import User from './user.ts'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'

export default class Role extends RoleSchema {
  @manyToMany(() => User, {
    pivotTable: 'user_assigned_roles',
    pivotForeignKey: 'role_id',
    pivotRelatedForeignKey: 'user_id',
    pivotColumns: ['expires_at', 'assigned_by_id'],
  })
  declare users: ManyToMany<typeof User>
}
