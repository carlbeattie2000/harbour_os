import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'port_calls'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('port_call_manifest_id')
        .references('id')
        .inTable('port_call_manifests')
        .notNullable()

      table.string('vessel_id').references('imo_number').inTable('vessels').notNullable()
      table.string('purpose').notNullable()
      table.string('status').defaultTo('pending').notNullable()
      table.string('priority').defaultTo('regular').notNullable()
      table.string('voyage_number').notNullable()

      table.integer('handling_time_estimated_hours').notNullable()
      table.integer('total_fees').defaultTo(0).notNullable()

      table.boolean('pilotage_required').notNullable().defaultTo(false)

      table.timestamp('eta').notNullable()
      table.timestamp('ata').nullable()
      table.timestamp('etd').notNullable()
      table.timestamp('atd').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.unique(['vessel_id', 'voyage_number'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
