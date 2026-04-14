import type { HttpContext } from '@adonisjs/core/http'

export default class DashboardController {
  async home({ view, auth }: HttpContext) {
    const user = auth.getUserOrFail()
    await user.load('roles')

    return view.render('pages/internal/home', { user })
  }
}
