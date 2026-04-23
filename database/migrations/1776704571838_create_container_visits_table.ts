import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'container_visits'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('container_id').notNullable().references('id').inTable('containers')
      table
        .integer('port_call_inbound_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('port_calls')
      table
        .integer('port_call_outbound_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('port_calls')
      table.integer('yard_slot_id').unsigned().notNullable().references('id').inTable('yard_slots')

      table.string('category').notNullable()
      table.string('hazmat_class').notNullable()
      table.string('status').notNullable()
      table.string('customs_status').notNullable()

      table.integer('declared_weight').notNullable()

      table.boolean('reefer_required').notNullable().defaultTo(false)
      table.boolean('oversize').notNullable().defaultTo(false)

      table.timestamp('storage_start').nullable()
      table.timestamp('storage_ends').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
