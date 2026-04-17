import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'vessels'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('imo_number').primary().notNullable()

      table.string('name').notNullable()
      table.string('flag_state').notNullable()
      table.string('type').notNullable()

      table.integer('gross_tonnage').notNullable()
      table.integer('loa').notNullable()
      table.integer('beam').notNullable()
      table.integer('max_draft').notNullable()
      table.integer('teu_capacity').notNullable()

      table
        .integer('shipping_line_id')
        .unsigned()
        .references('id')
        .inTable('accounts')
        .onDelete('CASCADE')
        .nullable()
      table
        .integer('port_agent_id')
        .unsigned()
        .references('id')
        .inTable('accounts')
        .onDelete('SET NULL')
        .nullable()

      table.string('status').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
