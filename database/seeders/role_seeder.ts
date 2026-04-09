import Role from '#models/role'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Role.createMany([
      { slug: 'portal' },
      { slug: 'equipment_operator' },
      { slug: 'reefer_technician' },
      { slug: 'tally_clerk' },
      { slug: 'trucking_dispatcher' },
      { slug: 'gate_operator' },
      { slug: 'inventory_controller' },
      { slug: 'freight_forwarder' },
      { slug: 'customs_officer' },
      { slug: 'billing_clerk' },
      { slug: 'yard_manager' },
      { slug: 'vessel_captain' },
      { slug: 'vessel_planner' },
      { slug: 'operations_manager' },
      { slug: 'admin' },
    ])
  }
}

