import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'port_call_manifests'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('estimated_unload_standard').notNullable()
      table.integer('estimated_unload_reefer').notNullable()
      table.integer('estimated_unload_hazmat').notNullable()
      table.integer('estimated_unload_oversize').notNullable()

      table.integer('estimated_load_standard').notNullable()
      table.integer('estimated_load_reefer').notNullable()
      table.integer('estimated_load_hazmat').notNullable()
      table.integer('estimated_load_oversize').notNullable()

      table.integer('estimated_unload').notNullable()
      table.integer('estimated_load').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
