import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'container_events'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('container_id').notNullable().references('id').inTable('containers')
      table.integer('port_call_id').unsigned().nullable().references('id').inTable('port_calls')
      table.integer('truck_visit_id').unsigned().nullable().references('id').inTable('truck_visits')

      table.enum('type', ['DISCHARGED', 'GATED_IN', 'GATED_OUT', 'LOADED', 'MOVED', 'EXCEPTION'])

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
