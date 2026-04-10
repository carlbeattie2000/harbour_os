export const ACCOUNT_TYPES = {
  SHIPPING_LINE: 'shipping_line',
  FREIGHT_FORWARDER: 'freight_forwarder',
  CUSTOMS_BROKER: 'customs_broker',
  HAULAGE: 'haulage',
  SLOT_OWNER: 'slot_owner',
} as const

export const ACCOUNT_TYPE_ROLES = {
  [ACCOUNT_TYPES.SHIPPING_LINE]: ['admin', 'vessel_planner', 'captain', 'agent_user'],
  [ACCOUNT_TYPES.FREIGHT_FORWARDER]: ['admin', 'account_user', 'account_readonly'],
  [ACCOUNT_TYPES.CUSTOMS_BROKER]: ['admin', 'account_user'],
  [ACCOUNT_TYPES.HAULAGE]: ['admin', 'dispatcher'],
  [ACCOUNT_TYPES.SLOT_OWNER]: ['admin', 'slot_manager'],
} as const

export const ACCOUNT_DEFAULT_ROLE = 'admin'

export type AccountType = typeof ACCOUNT_TYPES[keyof typeof ACCOUNT_TYPES]
