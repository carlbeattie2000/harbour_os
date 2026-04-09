import { UserSchema } from "#database/schema";
import hash from "@adonisjs/core/services/hash";
import { compose } from "@adonisjs/core/helpers";
import { withAuthFinder } from "@adonisjs/auth/mixins/lucid";
import Role from "./role.ts";
import { manyToMany } from "@adonisjs/lucid/orm";
import type { ManyToMany } from "@adonisjs/lucid/types/relations";

/**
 * User model represents a user in the application.
 * It extends UserSchema and includes authentication capabilities
 * through the withAuthFinder mixin.
 */
export default class User extends compose(UserSchema, withAuthFinder(hash)) {
  /**
   * Get the user's initials from their full name or email.
   * Returns the first letter of first and last name if available,
   * otherwise returns the first two characters of the email username.
   */
  @manyToMany(() => Role, {
    pivotTable: "user_assigned_roles",
    pivotForeignKey: "user_id",
    pivotRelatedForeignKey: "role_id",
    pivotColumns: ["expires_at", "assigned_by_id", "created_at"],
  })
  declare roles: ManyToMany<typeof Role>;

  @manyToMany(() => Role, {
    pivotTable: "user_account_assigned_roles",
    pivotForeignKey: "user_id",
    pivotRelatedForeignKey: "role_id",
    pivotColumns: ["expires_at", "assigned_by_id", "created_at"],
  })
  declare accountRoles: ManyToMany<typeof Role>;
}
