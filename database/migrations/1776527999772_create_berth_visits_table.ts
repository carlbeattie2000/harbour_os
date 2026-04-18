import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'berth_visits'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('port_call_id').unsigned().notNullable().references('id').inTable('port_calls')
      table.integer('berth_id').unsigned().notNullable().references('id').inTable('berths')

      table.timestamp('planned_arrival').notNullable()
      table.timestamp('acctual_arrival').nullable()
      table.timestamp('planned_departure').notNullable()
      table.timestamp('acctual_departure').nullable()

      table.string('purpose').notNullable()
      table.string('status').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
