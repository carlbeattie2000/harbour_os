import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'crane_berth_assignments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('crane_id').unsigned().notNullable().references('id').inTable('cranes')
      table
        .integer('berth_visit_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('berth_visits')

      table.integer('moves_completed').nullable().defaultTo(0)

      table.primary(['crane_id', 'berth_visit_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
