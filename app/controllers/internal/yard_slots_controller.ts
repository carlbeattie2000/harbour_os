import YardSlot from '#models/yard_slot';
import { createYardSlotValidator } from '#validators/yard_slot'
import type { HttpContext } from '@adonisjs/core/http'

export default class YardSlotsController {
  async create({ view }: HttpContext) {
    return view.render('pages/internal/yard_slots/create')
  }

  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(createYardSlotValidator);

    await YardSlot.create({ ...payload, ownership: 'port' });

    session.flash('success', 'Yard slot created');

    return response.redirect().toRoute('yard_slots.create');
  }
}
