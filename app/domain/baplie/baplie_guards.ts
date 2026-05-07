import { PortCallCannotAcceptBaplieException } from '#errors/baplie_upload_errors'
import type PortCall from '#models/port_call'
import { type PortCallStatus } from '../../contracts/port_call.ts'

const BAPLIE_UPLOADABLE_STATES: PortCallStatus[] = ['pending', 'scheduled', 'delayed']

export function assertPortCallAcceptsBaplie(portCall: PortCall) {
  assertValidStateForUpload(portCall)
}

function assertValidStateForUpload(portCall: PortCall) {
  if (!BAPLIE_UPLOADABLE_STATES.includes(portCall.status)) {
    throw new PortCallCannotAcceptBaplieException()
  }
}
