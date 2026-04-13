import Role from '#models/role'
import User from '#models/user'
import UserAssignedRole from '#models/user_assigned_role'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const systemAdmin = await User.create({
      firstName: 'system',
      lastName: 'admin',
      email: 'system_admin@shipping.com',
      password: 'admin',
    })

    const adminRole = await Role.findByOrFail({ slug: 'admin' })

    await UserAssignedRole.create({
      userId: systemAdmin.id,
      roleId: adminRole.id,
    })

    const portal = await User.create({
      firstName: 'portal',
      lastName: 'user',
      email: 'portal@shipping.com',
      password: 'portal',
    })

    const portalRole = await Role.findByOrFail({ slug: 'portal' })

    await UserAssignedRole.create({
      userId: portal.id,
      roleId: portalRole.id,
    })
  }
}
