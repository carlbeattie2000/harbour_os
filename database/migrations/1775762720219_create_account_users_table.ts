import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected tableName = "account_users";

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
        .integer("account_id")
        .unsigned()
        .references("id")
        .inTable("accounts")
        .onDelete("CASCADE")
        .notNullable();

      table.unique(["user_id", "account_id"]);
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
