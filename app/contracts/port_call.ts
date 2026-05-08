import type PortCall from '#models/port_call'
import type Vessel from '#models/vessel'

export type PortCallStatus =
  | 'pending'
  | 'approved'
  | 'awaiting_account_approval'
  | 'under_review'
  | 'canceled'
  | 'unable_to_accept'

export type PortCallOperationalPhase =
  | 'scheduled'
  | 'at_anchorage'
  | 'berthed'
  | 'operations_complete'
  | 'awaiting_outbound_cargo'
  | 'departed'
  | 'hold'
  | 'delayed'
  | 'reconciled'

export type PortCallWithVessel = PortCall & {
  vessel: Vessel & { shippingLineId: number }
}
