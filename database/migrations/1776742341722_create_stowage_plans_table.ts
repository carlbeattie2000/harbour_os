import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'stowage_plans'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('port_call_id').unsigned().notNullable().references('id').inTable('port_calls')

      table.string('container_id').notNullable().references('id').inTable('containers')

      table.enum('operation', ['LOAD', 'UNLOAD']).notNullable()

      table.integer('bay').notNullable()
      table.integer('row').notNullable()
      table.integer('tier').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
