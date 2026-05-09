import type { PortCallOperationalPhase, PortCallStatus } from '../../contracts/port_call.ts'

export const PORT_CALL_STATUS_TRANSITIONS: Record<PortCallStatus, PortCallStatus[]> = {
  pending: ['awaiting_account_approval', 'canceled', 'approved'],
  awaiting_account_approval: ['canceled', 'under_review', 'approved'],
  under_review: ['canceled', 'unable_to_accept', 'awaiting_account_approval', 'approved'],
  canceled: [],
  unable_to_accept: [],
  approved: ['canceled', 'under_review', 'awaiting_account_approval'],
}

export const PORT_CALL_PHASE_TRANSITIONS: Record<
  PortCallOperationalPhase,
  PortCallOperationalPhase[]
> = {
  not_started: ['scheduled'],
  scheduled: ['at_anchorage', 'hold'],
  at_anchorage: ['berthed', 'delayed'],
  berthed: ['operations_complete', 'delayed'],
  operations_complete: ['awaiting_outbound_cargo', 'reconciled'],
  awaiting_outbound_cargo: ['departed'],
  reconciled: ['departed'],
  departed: [],
  hold: ['scheduled'],
  delayed: ['berthed'],
}
