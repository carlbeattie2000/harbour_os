import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'yard_slots'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('bay').notNullable()
      table.integer('row').notNullable()
      table.unique(['bay', 'row'])
      table.integer('max_stack_height').notNullable()

      table.string('type').notNullable()
      table.string('ownership').notNullable()
      table
        .integer('owning_account_id')
        .unsigned()
        .references('id')
        .inTable('accounts')
        .nullable()
        .onDelete('SET NULL')

      table.string('status')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
