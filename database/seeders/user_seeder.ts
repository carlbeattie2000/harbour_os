import {
  ACCOUNT_DEFAULT_ROLE,
  ACCOUNT_TYPE_ROLES,
  type AccountType,
} from '#constants/account_types'
import Account from '#models/account'
import AccountUser from '#models/account_user'
import ContactDetail from '#models/contact_detail'
import Role from '#models/role'
import User from '#models/user'
import UserAccountAssignedRole from '#models/user_account_assigned_role'
import UserAccountRole from '#models/user_account_role'
import UserAssignedRole from '#models/user_assigned_role'
import Vessel from '#models/vessel'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const internalAdmin = await User.create({
      firstName: 'John',
      lastName: 'Smith',
      email: 'johnsmith@harbour-os.com',
      password: 'admin',
    })

    const adminRole = await Role.findByOrFail({ slug: 'admin' })

    await UserAssignedRole.create({
      userId: internalAdmin.id,
      roleId: adminRole.id,
    })

    const portalUser = await User.create({
      firstName: 'Mike',
      lastName: 'Smith',
      email: 'mikesmith@shadowpeak.com',
      password: 'portal',
    })

    const portalRole = await Role.findByOrFail({ slug: 'portal' })

    await UserAssignedRole.create({
      userId: portalUser.id,
      roleId: portalRole.id,
    })

    const shippingLineAddress = await ContactDetail.create({
      phone: '07444444444',
      email: 'info@shadowpeak.com',
      addressLine: '11 shadowpeak road',
      country: 'United Kingdom',
    })

    const shippingLineAccount = await Account.create({
      companyName: 'Shadow Peak Logistics',
      type: 'shipping_line',
      registrationNumber: '5454875454',
      billingAddressId: shippingLineAddress.id,
      status: 'active',
    })

    await AccountUser.create({
      accountId: shippingLineAccount.id,
      userId: portalUser.id,
    })

    const roles = ACCOUNT_TYPE_ROLES[shippingLineAccount.type as AccountType]
    const createdRoles = await UserAccountRole.createMany(
      roles.map((slug) => ({ accountId: shippingLineAccount.id, slug }))
    )
    const defaultRole = createdRoles.find((r) => r.slug === ACCOUNT_DEFAULT_ROLE)!

    await UserAccountAssignedRole.create({
      userId: portalUser.id,
      roleId: defaultRole.id,
    })

    await Vessel.create({
      imoNumber: '9456789',
      shippingLineId: shippingLineAccount.id,
      name: 'MV Velocity Horizon',
      flagState: 'Panama',
      type: 'Container Ship (Fully Cellular)',
      grossTonnage: 45250,
      loa: 268.5,
      beam: 32.2,
      maxDraft: 12.8,
      status: 'approved',
      teuCapacity: 4850,
    })
  }
}
