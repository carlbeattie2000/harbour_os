import type PortCall from '#models/port_call'
import type Vessel from '#models/vessel'

export type PortCallStatus =
  | 'pending'
  | 'awaiting_account_approval'
  | 'under_review'
  | 'scheduled'
  | 'manifest_submitted'
  | 'reconciled'
  | 'at_anchorage'
  | 'berthed'
  | 'operations_complete'
  | 'awaiting_outbound_cargo'
  | 'departed'
  | 'hold'
  | 'canceled'
  | 'delayed'
  | 'unable_to_accept'

export type PortCallWithVessel = PortCall & {
  vessel: Vessel & { shippingLineId: number }
}
