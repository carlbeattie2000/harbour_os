import { NotFoundError } from '#errors/app_error'
import User from '#models/user'
import { viewUserValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  async show({ request, view }: HttpContext) {
    const { params } = await request.validateUsing(viewUserValidator)

    const user = await User.find(params.id)

    if (!user) throw new NotFoundError()

    return view.render('pages/auth/view', { user })
  }
}
