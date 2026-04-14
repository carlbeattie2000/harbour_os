import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'containers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary().notNullable()

      table.string('size_type', 4).index().notNullable()
      table.string('type_group', 4).index().nullable()

      table.string('owner_code', 3).notNullable()
      table.string('category_indentifier', 1).notNullable()
      table.string('serial_number', 6).notNullable()
      table.integer('check_digit').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
