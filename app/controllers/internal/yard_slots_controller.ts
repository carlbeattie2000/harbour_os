import YardSlot from '#models/yard_slot'
import { createYardSlotValidator, viewAllYardSlotsValidator } from '#validators/yard_slot'
import type { HttpContext } from '@adonisjs/core/http'

const VIEW_YARD_SLOTS_QUERY_LIMIT = 20

export default class YardSlotsController {
  async create({ view }: HttpContext) {
    return view.render('pages/internal/yard_slots/create')
  }

  async store({ request, response, session }: HttpContext) {
    const { toRow, ...payload } = await request.validateUsing(createYardSlotValidator)

    const rows = toRow
      ? Array.from({ length: toRow - payload.row + 1 }, (_, i) => payload.row + i)
      : [payload.row]

    const existing = await YardSlot.query()
      .where('bay', payload.bay)
      .whereBetween('row', [payload.row, toRow ?? payload.row])
      .select('row')

    const existingRows = new Set(existing.map((s) => s.row))

    const newSlots = rows
      .filter((row) => !existingRows.has(row))
      .map((row) => ({ ...payload, row, ownership: 'port' as const }))

    if (newSlots.length) {
      await YardSlot.createMany(newSlots)
    }

    session.flash('success', `${newSlots.length} yard slots created`)

    return response.redirect().toRoute('yard_slots.create')
  }

  async index({ request, view }: HttpContext) {
    const { page } = await request.validateUsing(viewAllYardSlotsValidator)

    const yardSlots = await YardSlot.query()
      .orderBy('bay', 'asc')
      .paginate(page ?? 1, VIEW_YARD_SLOTS_QUERY_LIMIT)

    const yardSlotsSerialized = yardSlots.serialize()

    return view.render('pages/internal/yard_slots/view_all', {
      yardSlots: yardSlotsSerialized.data,
      yardSlotsMetadata: yardSlotsSerialized.meta,
    })
  }
}
