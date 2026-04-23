import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import type { NextFn } from '@adonisjs/core/types/http'
import db from '@adonisjs/lucid/services/db'
import { randomUUID } from 'node:crypto'
import { MigrationRunner } from '@adonisjs/lucid/migration'
import UserSeeder from '#database/seeders/user_seeder'
import RoleSeeder from '#database/seeders/role_seeder'
import BerthSeeder from '#database/seeders/berth_seeder'
import YardSeeder from '#database/seeders/yard_slot_seeder'
import { connectionStorage } from '#services/connection_storage_service'

export default class DemoSessionMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const visitorId = ctx.request.cookie('visitor_id', randomUUID())

    const hasConnection = db.manager.has(visitorId)

    if (!hasConnection) {
      db.manager.add(visitorId, {
        client: 'better-sqlite3',
        connection: { filename: app.tmpPath(visitorId + '.sqlite3') },
      })

      const migrator = new MigrationRunner(db, app, {
        direction: 'up',
        dryRun: false,
        connectionName: visitorId,
      })
      await migrator.run()
    }

    ctx.response.cookie('visitor_id', visitorId)

    return connectionStorage.run(visitorId, async () => {
      if (!hasConnection) {
        await new UserSeeder(db.connection(visitorId)).run()
        await new RoleSeeder(db.connection(visitorId)).run()
        await new BerthSeeder(db.connection(visitorId)).run()
        await new YardSeeder(db.connection(visitorId)).run()
      }

      return next()
    })
  }
}
