import { TenantSchema } from '#database/schema'
import { DateTime } from 'luxon'

export default class Tenant extends TenantSchema {
  static async createOrUpdate(vistorId: string): Promise<Tenant> {
    const tenant = await Tenant.findBy('clientId', vistorId)

    if (tenant) {
      await tenant.merge({ lastActive: DateTime.now() }).save()
      return tenant
    }

    return await Tenant.create({
      clientId: vistorId,
      lastActive: DateTime.now(),
    })
  }
}
