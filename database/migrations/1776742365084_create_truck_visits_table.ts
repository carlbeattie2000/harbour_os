import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'truck_visits'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('licence_plate').notNullable()

      table.enum('operation', ['DROP_OFF', 'PICKUP']).notNullable()
      table.enum('status', ['PLANNED', 'ARRIVED', 'COMPLETED']).notNullable()

      table.timestamp('expected_at').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
