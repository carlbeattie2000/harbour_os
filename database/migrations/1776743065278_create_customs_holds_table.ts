import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'customs_holds'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('container_id').notNullable().references('id').inTable('containers')

      table.string('reason').notNullable()
      table.string('placed_by').notNullable()

      table.timestamp('placed_at').notNullable()
      table.timestamp('lifted_at').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
