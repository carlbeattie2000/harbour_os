import Role from "#models/role";
import User from "#models/user";
import UserAssignedRole from "#models/user_assigned_role";
import MailService from "#services/mail_service";
import { createUserValidator } from "#validators/user";
import type { HttpContext } from "@adonisjs/core/http";
import { randomBytes } from "node:crypto";

export default class CreateUsersController {
  async create({ view }: HttpContext) {
    const roles = await Role.all();

    return view.render("pages/auth/create", { roles });
  }

  async store({ request, response, session }: HttpContext) {
    const { role, ...payload } = await request.validateUsing(createUserValidator);
    const password = randomBytes(14).toString('base64');

    const user = await User.create({
      ...payload,
      password
    })

    await UserAssignedRole.create({
      roleId: role,
      userId: user.id
    })

    MailService.SendNewUserPassword(user.email, user.email, password);

    session.flash('success', `User ${user.id} created.`)

    return response.redirect().toRoute('users.show', { id: user.id });
  }
}
