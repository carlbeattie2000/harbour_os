import Tenant from '#models/tenant'
import { TenantConnectionService } from '#services/tenant_connection_service'
import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { DateTime } from 'luxon'

export default class CleanDemoSessions extends BaseCommand {
  static commandName = 'clean:demo-sessions'
  static description = ''

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    const tenantsExpired = await Tenant.query().where(
      'lastActive',
      '<=',
      DateTime.now().minus({ hours: 1 }).toSQL()
    )

    const tenantService = new TenantConnectionService()

    for (const tenant of tenantsExpired) {
      await tenantService.uninstall(tenant.clientId)
    }
  }
}
