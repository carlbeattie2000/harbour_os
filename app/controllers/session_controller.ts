import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import limiter from '@adonisjs/limiter/services/main'

/**
 * SessionController handles user authentication and session management.
 * It provides methods for displaying the login page, authenticating users,
 * and logging out.
 */
export default class SessionController {
  /**
   * Display the login page
   */
  async create({ view }: HttpContext) {
    return view.render('pages/auth/login')
  }

  /**
   * Authenticate user credentials and create a new session
   */
  async store({ request, auth, response, session }: HttpContext) {
    const { email, password } = request.all()

    const loginLimiter = limiter.use({
      requests: 5,
      duration: '1 min',
      blockDuration: '20 mins'
    })

    const key = `login_${request.ip()}_${email}`

    const [error, user] = await loginLimiter.penalize(key, () => {
      return User.verifyCredentials(email, password)
    })

    if (error) {
      session.flash('error', `Too many login attempts. Try again after ${error.response.availableIn} seconds`)
      return response.redirect().back()
    }

    await auth.use('web').login(user)
    response.redirect().toRoute('home')
  }

  /**
   * Log out the current user and destroy their session
   */
  async destroy({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    response.redirect().toRoute('session.create')
  }
}
