import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_account_assigned_roles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE")
        .notNullable();
      table
        .integer("role_id")
        .unsigned()
        .references("id")
        .inTable("user_account_roles")
        .onDelete("CASCADE")
        .notNullable();
      table
        .integer("assigned_by_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("SET NULL")
        .nullable();

      table.timestamp("created_at").notNullable();
      table.timestamp("expires_at").nullable();

      table.primary(["user_id", "role_id"]);
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
