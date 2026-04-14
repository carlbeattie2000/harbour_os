import vine from '@vinejs/vine'

export const createPortCallValidator = vine.create({
  imoNumber: vine.string().trim().minLength(7).maxLength(7),
  purpose: vine.enum(['inbound_cargo', 'outbound_cargo', 'both', 'transit', 'services']),
  eta: vine.date({ formats: ['YYYY-MM-DDTHH:mm'] }),
  etd: vine.date({ formats: ['YYYY-MM-DDTHH:mm'] }),
  pilotageRequired: vine.accepted().optional(),
})
