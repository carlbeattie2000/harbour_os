import { createContainerValidator } from '#validators/container'
import type { HttpContext } from '@adonisjs/core/http'
import Container from '#models/container'
import iso6456_parser from '../../utils/iso6456_parser.ts'
import iso6456_size_type_parser from '../../utils/iso6456_size_type_parser.ts'

export default class ContainersController {
  async create({ view }: HttpContext) {
    return view.render('pages/containers/create')
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createContainerValidator)
    const parsedContainerNumber = iso6456_parser(payload.number)
    // Not the best, but this will throw and show error if invalid sizeCode is given
    iso6456_size_type_parser(payload.sizeCode)

    await Container.create({
      id: payload.number,
      ownerCode: parsedContainerNumber.ownerCode,
      categoryIndentifier: parsedContainerNumber.category,
      serialNumber: parsedContainerNumber.serial,
      checkDigit: parsedContainerNumber.checkDigit,
      sizeType: payload.sizeCode,
    })

    return response.redirect().toRoute('containers.create')
  }
}
