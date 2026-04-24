import { NotFoundError } from '#errors/app_error'
import User from '#models/user'
import { viewUsersValidator, viewUserValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  async show({ request, view }: HttpContext) {
    const { params } = await request.validateUsing(viewUserValidator)

    const user = await User.find(params.id)

    if (!user) throw new NotFoundError()

    return view.render('pages/auth/view', { user })
  }

  async all({ request, view }: HttpContext) {
    const { page } = await request.validateUsing(viewUsersValidator)
    const users = await User.query().paginate(page ?? 1, 30)
    const usersSerialized = users.serialize()

    return view.render('pages/internal/users/view_all', {
      users: usersSerialized.data,
      userMeta: usersSerialized.meta,
    })
  }
}
