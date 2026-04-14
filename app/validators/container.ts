import vine from '@vinejs/vine'

export const createContainerValidator = vine.create({
  number: vine.string().trim().minLength(11).maxLength(11),
  sizeCode: vine.string().trim(),
})
