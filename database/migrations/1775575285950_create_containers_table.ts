import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'containers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary().notNullable();

      table.string('type_group').index().notNullable();
      table.string('size_type').index().notNullable();

      table.string('owner_code').notNullable();
      table.string('category_indentifier').notNullable();
      table.string('serial_number').notNullable();
      table.integer('check_digit').notNullable();

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
