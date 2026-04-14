import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'accounts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('company_name').notNullable()
      table.string('type').notNullable()
      table.string('registration_number').notNullable()

      table
        .integer('billing_address_id')
        .unsigned()
        .references('id')
        .inTable('contact_details')
        .onDelete('SET NULL')
        .nullable()

      table.string('credit_terms').nullable()
      table.string('status').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
