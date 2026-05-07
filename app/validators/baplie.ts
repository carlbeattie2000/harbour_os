import vine from '@vinejs/vine'

export const createBaplieUploadValidator = vine.create({
  content: vine.string().trim(),
})

export const confirmBaplieUploadValidator = vine.create({
  cacheId: vine.string(),
})

export const viewStowagePlanByVesselNumber = vine.create({
  params: vine.object({
    voyageNumber: vine.string(),
  }),
})
