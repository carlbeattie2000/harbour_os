import { addUserToAccountValidator } from '#validators/account'
import db from '@adonisjs/lucid/services/db'
import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { RbacService } from '#services/rbac_service'
import AccountUser from '#models/account_user'
import UserAccountAssignedRole from '#models/user_account_assigned_role'

export default class AddUsersController {
  async create({ view, account }: HttpContext) {
    await account.load('roles')
    return view.render('pages/portal/account/add_user', {
      roles: account.roles,
      account,
    })
  }

  async store({ request, account, session, response }: HttpContext) {
    const { email, role } = await request.validateUsing(addUserToAccountValidator)
    return await db.transaction(async (trx) => {
      const user = await User.query({ client: trx }).select('id').where('email', email).first()

      if (!user) {
        session.flash('error', `User with email ${email} does not exist`)
        return response.redirect().back()
      }

      const existingMembership = await account
        .useTransaction(trx)
        .related('users')
        .query()
        .where('id', user.id)
        .select('id')
        .first()

      if (existingMembership) {
        session.flash('error', `User with email ${email} is already a member of this account`)
        return response.redirect().back()
      }

      const userRoles = await RbacService.getUserRoles(user, trx)

      if (!RbacService.HasRole(userRoles, ['portal'], false)) {
        session.flash('error', `User with email ${email} does not exist`)
        return response.redirect().back()
      }

      await AccountUser.create(
        {
          accountId: account.id,
          userId: user.id,
        },
        { client: trx }
      )

      await UserAccountAssignedRole.create({ roleId: role, userId: user.id }, { client: trx })

      session.flash('success', `User with email ${email} was added to the account`)
      return response.redirect().toRoute('view_account.show', { id: account.id })
    })
  }
}
