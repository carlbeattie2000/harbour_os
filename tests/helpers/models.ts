import { DateTime } from 'luxon'

import Account from '#models/account'
import AccountUser from '#models/account_user'
import User from '#models/user'
import UserAccountAssignedRole from '#models/user_account_assigned_role'
import UserAccountRole from '#models/user_account_role'
import UserAssignedRole from '#models/user_assigned_role'
import Vessel from '#models/vessel'
import PortCall from '#models/port_call'
import Role from '#models/role'
import PortCallManifest from '#models/port_call_manifest'

import type { ContainerTypes } from '../../app/contracts/yard_forecasting.ts'
import { ACCOUNT_TYPE_ROLES, type AccountType } from '#constants/account_types'
import type { PortCallStatus } from '../../app/contracts/port_call.ts'
import type { AccountRoles, UserRoles } from '../../app/contracts/roles.ts'
import YardSlot from '#models/yard_slot'
import ContainerVisit from '#models/container_visit'
import Container from '#models/container'

export const createUser = async () => {
  const firstNames = ['John', 'Jane', 'Alice', 'Bob', 'Charlie']
  const lastNames = ['Doe', 'Smith', 'Johnson', 'Brown', 'Davis']
  const email = () =>
    firstNames[Math.floor(Math.random() * firstNames.length)].toLowerCase() +
    '.' +
    lastNames[Math.floor(Math.random() * lastNames.length)].toLowerCase() +
    '@example.com'
  const password = 'password123'

  return await User.create({
    firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
    lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
    email: email(),
    password,
    active: true,
  })
}

export const giveUserRole = async (userId: number, slug: UserRoles) => {
  const role = await Role.findByOrFail('slug', slug)
  await UserAssignedRole.create({
    userId,
    roleId: role.id,
  })
}

export const createAccountRoles = async (accountType: AccountType, accountId: number) => {
  const roles = ACCOUNT_TYPE_ROLES[accountType]

  roles.forEach(async (role) => {
    await UserAccountRole.create({
      slug: role,
      accountId,
    })
  })
}

export const createAccount = async (type: 'shipping_line' | 'freight_forwarder') => {
  const companyNames = ['Acme Corp', 'Globex Inc', 'Initech', 'Umbrella Corp', 'Hooli']
  const registrationNumber = () => Math.random().toString(36).substring(2, 10).toUpperCase()
  const creditTerms = ['Net 30', 'Net 60', 'Net 90', 'Due on Receipt', 'End of Month']

  const account = await Account.create({
    companyName: companyNames[Math.floor(Math.random() * companyNames.length)],
    type,
    registrationNumber: registrationNumber(),
    creditTerms: creditTerms[Math.floor(Math.random() * creditTerms.length)],
    status: 'active',
  })

  await createAccountRoles(type, account.id)

  return account
}

export const addUserToAccount = async (userId: number, accountId: number) => {
  await AccountUser.create({
    userId,
    accountId,
  })
}

export const addUserRoleToAccount = async (userId: number, roleSlug: AccountRoles) => {
  const accountRole = await UserAccountRole.findByOrFail('slug', roleSlug)

  await UserAccountAssignedRole.create({
    userId,
    roleId: accountRole.id,
  })
}

export const createVessel = async (shippingLineId: number) => {
  const imoNumber = () => Math.floor(1000000 + Math.random() * 9000000).toString()

  const name = ['Evergreen', 'Maersk', 'Hapag-Lloyd', 'CMA CGM', 'MSC']
  const flagState = ['Panama', 'Liberia', 'Marshall Islands', 'Hong Kong', 'Singapore']
  const type = ['Container Ship', 'Bulk Carrier', 'Tanker', 'Ro-Ro', 'General Cargo']
  const grossTonnage = Math.floor(10000 + Math.random() * 90000)
  const loa = Math.floor(100 + Math.random() * 300)
  const beam = Math.floor(20 + Math.random() * 50)
  const maxDraft = Math.floor(10 + Math.random() * 20)
  const teuCapacity = Math.floor(1000 + Math.random() * 10000)
  const status = 'active'

  return await Vessel.create({
    imoNumber: imoNumber(),
    name: name[Math.floor(Math.random() * name.length)],
    flagState: flagState[Math.floor(Math.random() * flagState.length)],
    type: type[Math.floor(Math.random() * type.length)],
    grossTonnage,
    loa,
    beam,
    maxDraft,
    teuCapacity,
    status,
    shippingLineId,
  })
}

export const createPortCallManifest = async (
  inboundContainerTypes: ContainerTypes,
  outboundContainerTypes: ContainerTypes
) => {
  const estimatedUnloadStandard = inboundContainerTypes.standard
  const estimatedUnloadReefer = inboundContainerTypes.reefer
  const estimatedUnloadHazmat = inboundContainerTypes.hazmat
  const estimatedUnloadOversize = inboundContainerTypes.oversize

  const estimatedLoadStandard = outboundContainerTypes.standard
  const estimatedLoadReefer = outboundContainerTypes.reefer
  const estimatedLoadHazmat = outboundContainerTypes.hazmat
  const estimatedLoadOversize = outboundContainerTypes.oversize

  const estimatedUnload =
    estimatedUnloadStandard +
    estimatedUnloadReefer +
    estimatedUnloadHazmat +
    estimatedUnloadOversize
  const estimatedLoad =
    estimatedLoadStandard + estimatedLoadReefer + estimatedLoadHazmat + estimatedLoadOversize

  return await PortCallManifest.create({
    estimatedUnloadStandard,
    estimatedUnloadReefer,
    estimatedUnloadHazmat,
    estimatedUnloadOversize,
    estimatedLoadStandard,
    estimatedLoadReefer,
    estimatedLoadHazmat,
    estimatedLoadOversize,
    estimatedUnload,
    estimatedLoad,
  })
}

export const createPortCall = async (
  vesselImo: string,
  purpose: 'arrival' | 'departure',
  inboundContainerCounts: ContainerTypes,
  outboundContainerCounts: ContainerTypes
) => {
  const manifest = await createPortCallManifest(inboundContainerCounts, outboundContainerCounts)
  const status: PortCallStatus = 'scheduled'
  const priority = 'regular'
  const voyageNumber = Math.random().toString(36).substring(2, 10).toUpperCase()
  const pilotageRequired = Math.random() < 0.5
  const eta = DateTime.now().plus({ days: Math.floor(Math.random() * 30) + 1 })
  const etd = eta.plus({ hours: Math.floor(Math.random() * 48) + 1 })

  return await PortCall.create({
    vesselId: vesselImo,
    portCallManifestId: manifest.id,
    voyageNumber,
    pilotageRequired,
    status,
    priority,
    purpose,
    eta,
    etd,
    handlingTimeEstimatedHours: 0,
    totalFees: 0,
  })
}

export const createContainer = async () => {
  const ownerCode = Math.random().toString(36).substring(2, 5).toUpperCase()
  const categoryIndentifier = 'U'
  const serialNumber = Math.random().toString(36).substring(2, 7).toUpperCase()
  const checkDigit = Math.floor(Math.random() * 10)

  const isoNumber = `${ownerCode}${categoryIndentifier}${serialNumber}${checkDigit}`

  return await Container.create({
    id: isoNumber,
    sizeType: '40ft',
    typeGroup: 'standard',
    ownerCode,
    categoryIndentifier,
    serialNumber,
    checkDigit,
  })
}

export const createContainerVisit = async (portCallId: number) => {
  const container = await createContainer()

  const yardSlot = await YardSlot.query().where('status', 'available').firstOrFail()

  return await ContainerVisit.create({
    containerId: container.id,
    yardSlotId: yardSlot.id,
    category: 'standard',
    hazmatClass: 'none',
    status: 'in_yard',
    customsStatus: 'cleared',
    declaredWeight: Math.floor(1000 + Math.random() * 20000),
    reeferRequired: false,
    oversize: false,
    storageStart: DateTime.now(),
    portCallInboundId: portCallId,
  })
}
