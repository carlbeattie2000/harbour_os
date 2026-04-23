import db from '@adonisjs/lucid/services/db'
import multitenancyConfig from '#config/multitenancy'
import type { PostgreConfig } from '@adonisjs/lucid/types/database'
import type { MigratorOptions } from '@adonisjs/lucid/types/migrator'
import { MigrationRunner } from '@adonisjs/lucid/migration'
import UserSeeder from '#database/seeders/user_seeder'
import RoleSeeder from '#database/seeders/role_seeder'
import BerthSeeder from '#database/seeders/berth_seeder'
import YardSeeder from '#database/seeders/yard_slot_seeder'

import app from '@adonisjs/core/services/app'

export class TenantConnectionService {
  connectionNameFromHeader(tenantId: string) {
    return `${multitenancyConfig.tenantConnectionNamePrefix}${tenantId}`
  }

  schemaNameFromHeader(tenantId: string) {
    return `${multitenancyConfig.tenantSchemaPrefix}${tenantId}`
  }

  private async createSchema(tenantId: string) {
    const schemaName = this.schemaNameFromHeader(tenantId)
    await db.rawQuery(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`)
  }

  private async dropSchema(tenantId: string) {
    const schemaName = this.schemaNameFromHeader(tenantId)
    await db.rawQuery(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`)
  }

  async closeConnection(tenantId: string) {
    await db.manager.close(this.connectionNameFromHeader(tenantId))
  }

  async migrate(tenantId: string, options: Omit<MigratorOptions, 'connectionName'>) {
    const migrator = new MigrationRunner(db, app, {
      ...options,
      connectionName: this.connectionNameFromHeader(tenantId),
    })

    await migrator.run()

    if (migrator.error) {
      throw migrator.error
    }

    return migrator
  }

  async seed(tenantId: string) {
    const connection = this.getConnection(tenantId)

    await new RoleSeeder(connection).run()
    await new UserSeeder(connection).run()
    await new BerthSeeder(connection).run()
    await new YardSeeder(connection).run()
  }

  hasConnection(tenantId: string): boolean {
    return db.manager.has(this.connectionNameFromHeader(tenantId))
  }

  getConnection(tenantId: string) {
    const connectionName = this.connectionNameFromHeader(tenantId)
    if (db.manager.has(connectionName)) {
      return db.connection(connectionName)
    }

    const config = db.manager.get('pg')?.config

    db.manager.add(connectionName, {
      ...config,
      searchPath: [this.schemaNameFromHeader(tenantId)],
    } as PostgreConfig)

    return db.connection(connectionName)
  }

  async install(tenantId: string) {
    await this.createSchema(tenantId)

    this.getConnection(tenantId)

    await this.migrate(tenantId, { direction: 'up' })

    await this.seed(tenantId)
  }

  async uninstall(tenantId: string) {
    await this.closeConnection(tenantId)
    await this.dropSchema(tenantId)
  }
}
