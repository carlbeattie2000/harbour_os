import vine from '@vinejs/vine'

export const queryPendingListValidator = vine.create({
  qs: vine.object({
    page: vine.number().min(1).optional(),
  }).optional(),
})

export const createVesselValidator = vine.create({
  imoNumber: vine.string().trim().minLength(7).maxLength(7),
  name: vine.string().trim(),
  flagState: vine.string().trim(),
  type: vine.string().trim(),
  grossTonnage: vine.number().min(0),
  loa: vine.number().min(0),
  beam: vine.number().min(0),
  maxDraft: vine.number().min(0),
})
