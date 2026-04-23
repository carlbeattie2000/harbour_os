import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'fee_events'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('port_call_id').unsigned().references('id').inTable('port_calls').notNullable()
      table
        .string('container_visit_id')
        .references('id')
        .inTable('containers')
        .nullable()
        .onDelete('SET NULL')

      table.string('event_type').notNullable()

      table.timestamp('occurred_at').notNullable()

      table.integer('quantity').notNullable().defaultTo(1)
      table.integer('unit_rate').notNullable()
      table.integer('total_amount').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
