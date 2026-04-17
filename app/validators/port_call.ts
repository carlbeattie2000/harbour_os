import vine from '@vinejs/vine'

export const getPortCallValidator = vine.create({
  params: vine.object({
    id: vine.number().min(0),
  }),
})

export const createPortCallValidator = vine.create({
  imoNumber: vine.string().trim().minLength(7).maxLength(7),
  purpose: vine.enum(['inbound_cargo', 'outbound_cargo', 'both', 'transit', 'services']),
  eta: vine.date({ formats: ['YYYY-MM-DDTHH:mm'] }),
  etd: vine.date({ formats: ['YYYY-MM-DDTHH:mm'] }),
  pilotageRequired: vine.accepted().optional(),
  estimatedDischargeContainers: vine.number().min(0),
  estimatedLoadContainers: vine.number().min(0),
  voyageNumber: vine.string().trim().minLength(1).maxLength(50),
})
