import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'berth_available_cranes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .integer('berth_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('berths')
        .onDelete('CASCADE')
      table
        .integer('crane_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('cranes')
        .onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
