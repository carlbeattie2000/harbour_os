import type { HttpContext } from '@adonisjs/core/http'

export default class DashboardController {
  async home({ view, account, auth }: HttpContext) {
    const user = auth.getUserOrFail()
    await user.load('accountRoles')

    return view.render('pages/portal/account/home', { account, user })
  }
}
