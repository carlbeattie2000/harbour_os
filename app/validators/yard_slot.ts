import vine from '@vinejs/vine'

export const createYardSlotValidator = vine.create({
  bay: vine.string().trim().transform(str => str.toUpperCase()),
  row: vine.number().min(0),
  maxStackHeight: vine.number().min(0),
  type: vine.string().trim().transform(str => str.toLowerCase()),
})
