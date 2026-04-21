import { PortCallManifestSchema } from '#database/schema'
import { hasOne } from '@adonisjs/lucid/orm'
import PortCall from './port_call.ts'
import type { HasOne } from '@adonisjs/lucid/types/relations'

export default class PortCallManifest extends PortCallManifestSchema {
  @hasOne(() => PortCall)
  declare portCall: HasOne<typeof PortCall>
}
