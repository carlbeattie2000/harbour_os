import type { PortCallStatus } from '../../contracts/port_call.ts'

export const PORT_CALL_TRANSITIONS: Record<PortCallStatus, PortCallStatus[]> = {
  pending: ['awaiting_account_approval', 'canceled'],
  awaiting_account_approval: ['scheduled', 'canceled'],
  scheduled: ['manifest_submitted', 'at_anchorage', 'hold', 'canceled', 'under_review'],
  manifest_submitted: ['at_anchorage', 'hold', 'canceled', 'under_review'],
  under_review: ['scheduled', 'canceled', 'unable_to_accept'],
  at_anchorage: ['berthed', 'delayed', 'canceled'],
  berthed: ['operations_complete', 'delayed'],
  operations_complete: ['awaiting_outbound_cargo', 'reconciled'],
  awaiting_outbound_cargo: ['departed'],
  reconciled: ['departed'],
  departed: [],
  hold: ['scheduled', 'canceled'],
  delayed: ['berthed', 'canceled'],
  canceled: [],
  unable_to_accept: [],
}
