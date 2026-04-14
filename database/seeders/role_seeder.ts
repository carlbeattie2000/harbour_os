import Role from '#models/role'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Role.createMany([
      { slug: 'portal' },
      { slug: 'equipment_operator' },
      { slug: 'reefer_technician' },
      { slug: 'tally_clerk' },
      { slug: 'gate_operator' },
      { slug: 'inventory_controller' },
      { slug: 'billing_clerk' },
      { slug: 'yard_manager' },
      { slug: 'operations_manager' },
      { slug: 'admin' },
    ])
  }
}
