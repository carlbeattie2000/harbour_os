import Role from '#models/role'
import User from '#models/user'
import UserAssignedRole from '#models/user_assigned_role'
import { signupValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import limiter from '@adonisjs/limiter/services/main'
import db from '@adonisjs/lucid/services/db'

/**
 * NewAccountController handles user registration.
 * It provides methods for displaying the signup page and creating
 * new user accounts.
 */
export default class NewAccountController {
  /**
   * Display the signup page
   */
  async create({ view }: HttpContext) {
    return view.render('pages/auth/signup')
  }

  /**
   * Create a new user account and authenticate the user
   */
  async store({ request, response, auth, session }: HttpContext) {
    const payload = await request.validateUsing(signupValidator)

    const registerLimiter = limiter.use({
      requests: 2,
      duration: '1 min',
      blockDuration: '30 mins',
    })

    const key = `register_${request.ip()}`

    const user = await registerLimiter.attempt(key, async () => {
      const trx = await db.transaction()

      try {
        const user = await User.create({ ...payload }, { client: trx })
        const normalRole = await Role.findByOrFail({ slug: 'normal' }, { client: trx })

        await UserAssignedRole.create({ roleId: normalRole.id, userId: user.id }, { client: trx })

        await trx.commit()
        return user
      } catch (error) {
        await trx.rollback()
        throw error
      }
    })

    if (!user) {
      session.flash('error', 'Too many signup attempts. Please try again later.')
      return response.redirect().back()
    }

    await auth.use('web').login(user)
    return response.redirect().toRoute('home')
  }
}
