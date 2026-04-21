import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cargo_releases'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('container_id').notNullable().references('id').inTable('containers')
      table
        .integer('shipping_line_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('accounts')
      table.integer('truck_visit_id').unsigned().nullable().references('id').inTable('truck_visits')

      table.string('release_ref').notNullable()

      table.timestamp('issued_at').notNullable()
      table.timestamp('collected_at').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
