import type { HttpContext } from '@adonisjs/core/http'
import {
  ACCOUNT_DEFAULT_ROLE,
  ACCOUNT_TYPE_ROLES,
  ACCOUNT_TYPES,
} from '../constants/account_types.ts'
import { COUNTRIES } from '../constants/countries.ts'
import { createAccountValidator, createAccountWithUserValidator } from '#validators/account'
import User from '#models/user'
import { RbacService } from '#services/rbac_service'
import { UserNotPortalError } from '../errors/account_error.ts'
import db from '@adonisjs/lucid/services/db'
import Account from '#models/account'
import ContactDetail from '#models/contact_detail'
import AccountUser from '#models/account_user'
import UserAccountRole from '#models/user_account_role'
import UserAccountAssignedRole from '#models/user_account_assigned_role'

export default class CreateAccountsController {
  async create({ view, request }: HttpContext) {
    const { userId } = await request.validateUsing(createAccountWithUserValidator)
    const accountTypes = Object.values(ACCOUNT_TYPES)
    return view.render('pages/accounts/create', {
      accountTypes,
      countries: COUNTRIES,
      userId,
    })
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createAccountValidator)

    const user = await User.findOrFail(payload.userId)
    const userRoles = await RbacService.getUserRoles(user)

    if (!RbacService.HasRole(userRoles, ['portal'], true)) {
      throw new UserNotPortalError()
    }

    await db.transaction(async (trx) => {
      const accountBillingAddress = await ContactDetail.create(
        {
          phone: payload.phone,
          email: payload.email,
          addressLine: payload.addressLine,
          country: payload.country,
        },
        { client: trx }
      )

      const account = await Account.create(
        {
          companyName: payload.companyName,
          billingAddressId: accountBillingAddress.id,
          registrationNumber: payload.registrationNumber,
          type: payload.accountType,
          status: 'active',
        },
        { client: trx }
      )

      await AccountUser.create(
        {
          accountId: account.id,
          userId: user.id,
        },
        { client: trx }
      )

      const roles = ACCOUNT_TYPE_ROLES[payload.accountType]
      const createdRoles = await UserAccountRole.createMany(
        roles.map((slug) => ({ accountId: account.id, slug })),
        { client: trx }
      )
      const defaultRole = createdRoles.find((r) => r.slug === ACCOUNT_DEFAULT_ROLE)!

      await UserAccountAssignedRole.create(
        {
          userId: user.id,
          roleId: defaultRole.id,
        },
        { client: trx }
      )
    })

    return response.redirect().toRoute('users.show', { id: user.id })
  }
}
