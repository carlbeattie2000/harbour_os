import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'berths'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('code', 254).notNullable()

      table.integer('length').notNullable()
      table.integer('max_draft').notNullable()
      table.integer('max_beam').nullable()

      table.string('status').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
