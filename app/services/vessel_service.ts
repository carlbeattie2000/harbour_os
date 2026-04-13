import { type Infer } from '@vinejs/vine/types'
import { type createVesselValidator } from '#validators/vessel'
import Vessel from '#models/vessel'

export class VesselService {
  async create(
    data: Infer<typeof createVesselValidator>,
    options: { approved?: boolean; portAgentId?: number; accountId?: number }
  ) {
    await Vessel.create({
      ...data,
      shippingLineId: options.accountId,
      portAgentId: options.portAgentId,
      status: options.approved ? 'approved' : 'awaiting_approval',
    })
  }
}
