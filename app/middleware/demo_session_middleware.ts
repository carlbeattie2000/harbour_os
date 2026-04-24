import Tenant from '#models/tenant'
import { connectionStorage } from '#services/connection_storage_service'
import { TenantConnectionService } from '#services/tenant_connection_service'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { randomUUID } from 'node:crypto'

export default class DemoSessionMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const visitorId = ctx.request.cookie('visitor_id', randomUUID())

    if (!ctx.request.cookie('vistor_id')) {
      ctx.response.cookie('visitor_id', visitorId)
    }

    await Tenant.createOrUpdate(visitorId)

    const connectionService = new TenantConnectionService()

    const connectionName = connectionService.connectionNameFromHeader(visitorId)

    return connectionStorage.run(connectionName, async () => {
      if (!connectionService.hasConnection(visitorId)) {
        connectionService.getConnection(visitorId)

        await connectionService.install(visitorId)
      }
      return next()
    })
  }
}
