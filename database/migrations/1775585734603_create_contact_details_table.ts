import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'contact_details'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('phone').notNullable()
      table.string('email').notNullable()
      table.string('address_line').notNullable()
      table.string('country').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
