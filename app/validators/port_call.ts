import vine from '@vinejs/vine'

export const getPortCallValidator = vine.create({
  params: vine.object({
    id: vine.number().min(0),
  }),
})

export const approvePortCall = vine.create({
  params: vine.object({
    id: vine.number().min(0),
  }),
  berthId: vine.number().min(0),
  craneIds: vine.array(vine.number()).notEmpty(),
})

export const createPortCallValidator = vine.create({
  imoNumber: vine.string().trim().minLength(7).maxLength(7),
  purpose: vine.enum(['inbound_cargo', 'outbound_cargo', 'both', 'transit', 'services']),
  eta: vine.date({ formats: ['YYYY-MM-DDTHH:mm'] }),
  etd: vine.date({ formats: ['YYYY-MM-DDTHH:mm'] }),
  pilotageRequired: vine.accepted().optional(),
  voyageNumber: vine.string().trim().minLength(1).maxLength(50),
  estimatedUnloadStandard: vine.number().min(0),
  estimatedUnloadReefer: vine.number().min(0),
  estimatedUnloadHazmat: vine.number().min(0),
  estimatedUnloadOversize: vine.number().min(0),
  estimatedLoadStandard: vine.number().min(0),
  estimatedLoadReefer: vine.number().min(0),
  estimatedLoadHazmat: vine.number().min(0),
  estimatedLoadOversize: vine.number().min(0),
})
