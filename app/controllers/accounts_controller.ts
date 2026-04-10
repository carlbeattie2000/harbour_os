import type { HttpContext } from '@adonisjs/core/http'

export default class AccountsController {
  async show({ view, account }: HttpContext) {
    await account.load('users', (query) => {
      query.preload('accountRoles');
    });
    return view.render('pages/portal/account/view', { account });
  }
}
