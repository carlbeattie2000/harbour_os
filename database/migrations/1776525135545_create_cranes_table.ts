import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cranes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('code').notNullable()

      table
        .integer('berth_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('berths')
        .onDelete('SET NULL')

      table.integer('efficiency_rate').notNullable().defaultTo(0)

      table.string('status').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
