import Role from '#models/role';
import User from '#models/user'
import UserAssignedRole from '#models/user_assigned_role';
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const systemAdmin = await User.create({
      fullName: 'System Admin',
      email: 'system_admin@shipping.com',
      password: 'admin'
    });

    const adminRole = await Role.findByOrFail({ slug: 'admin' });

    await UserAssignedRole.create({
      userId: systemAdmin.id,
      roleId: adminRole.id
    })

    const normal = await User.create({
      fullName: 'Normal User',
      email: 'normal@shipping.com',
      password: 'normal'
    });

    const normalRole = await Role.findByOrFail({ slug: 'normal' });

    await UserAssignedRole.create({
      userId: normal.id,
      roleId: normalRole.id
    })
  }
}
