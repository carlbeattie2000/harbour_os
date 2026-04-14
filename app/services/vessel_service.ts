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

  async queryPending(page: number = 1) {
    return await Vessel.query().where('status', 'awaiting_approval').paginate(page, 20);
  }
}
