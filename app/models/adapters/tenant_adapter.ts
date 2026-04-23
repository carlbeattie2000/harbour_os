import type { LucidModel, ModelAdapterOptions } from '@adonisjs/lucid/types/model'
import DefaultLucidAdapter from './default_lucid_adapter.ts'
import env from '#start/env'
import { connectionStorage } from '#services/connection_storage_service'

export default class TenantAdapter extends DefaultLucidAdapter {
  override modelConstructorClient(modelConstructor: LucidModel, options?: ModelAdapterOptions) {
    if (!env.get('IS_DEMO')) {
      return super.modelConstructorClient(modelConstructor, options)
    }

    if (options?.client) {
      return options.client
    }

    const connection =
      options?.connection || connectionStorage.getStore() || modelConstructor.connection

    return this.db.connection(connection)
  }
}
