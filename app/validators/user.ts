import vine from '@vinejs/vine'

/**
 * Shared rules for email and password.
 */
const email = () => vine.string().email().maxLength(254)
const password = () => vine.string().minLength(8).maxLength(32)

/**
 * Validator to use when performing self-signup
 */
export const signupValidator = vine.create({
  fullName: vine.string().nullable(),
  email: email().unique({ table: 'users', column: 'email' }),
  password: password().confirmed({
    confirmationField: 'passwordConfirmation',
  }),
})

export const createUserValidator = vine.create({
  firstName: vine.string().trim(),
  lastName: vine.string().trim(),
  email: vine.string().trim().email(),
  role: vine.number().min(0),
})

export const viewUserValidator = vine.create({
  params: vine.object({
    id: vine.number().min(0),
  }),
})

export const viewUsersValidator = vine.create({
  page: vine.number().optional(),
})
