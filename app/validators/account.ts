import vine from '@vinejs/vine'
import { COUNTRIES } from '../constants/countries.ts'
import { ACCOUNT_TYPES } from '../constants/account_types.ts'

export const accountIdParamValidator = vine.create({
  params: vine.object({ id: vine.number().min(0) }),
})

export const createAccountWithUserValidator = vine.create({
  userId: vine.number().min(0),
})

export const createAccountValidator = vine.create({
  userId: vine.number().min(0),
  companyName: vine.string().trim(),
  registrationNumber: vine.string().trim(),
  email: vine.string().trim().email(),
  phone: vine.string().trim(),
  addressLine: vine.string().trim(),
  country: vine.enum(COUNTRIES.map((country) => country.name)),
  accountType: vine.enum(Object.values(ACCOUNT_TYPES)),
})

export const addUserToAccountValidator = vine.create({
  email: vine.string().trim().email(),
  role: vine.number().min(0)
})
