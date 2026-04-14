import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'port_calls'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('vessel_id').references('imo_number').inTable('vessels').notNullable()

      table.string('status').notNullable()

      table.timestamp('eta').notNullable()

      table.timestamp('ata').nullable()
      table.timestamp('etd').nullable()
      table.timestamp('atd').nullable()

      table.string('purpose').notNullable()

      table.boolean('pilotage_required').notNullable()

      table.integer('total_fees').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
