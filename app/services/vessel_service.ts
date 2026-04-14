import { type Infer } from '@vinejs/vine/types'
import { type createVesselValidator } from '#validators/vessel'
import Vessel from '#models/vessel'

const PENDING_QUERY_LIMIT = 20

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
    return await Vessel.query()
      .where('status', 'awaiting_approval')
      .preload('account', (query) => query.select('companyName').select('id'))
      .paginate(page, PENDING_QUERY_LIMIT)
  }

  async approveVessel(imoNumber: string): Promise<string> {
    const vessel = await Vessel.query().where('imoNumber', imoNumber).first()

    if (!vessel) {
      return `Vessel ${imoNumber} not found`
    }

    await vessel.merge({ status: 'approved' }).save()

    return `Vessel ${imoNumber} approved`
  }

  async denyVessel(imoNumber: string) {
    const vessel = await Vessel.query().where('imoNumber', imoNumber).first()

    if (!vessel) {
      return `Vessel ${imoNumber} not found`
    }

    await vessel.merge({ status: 'denied' }).save()

    return `Vessel ${imoNumber} denied`
  }
}
