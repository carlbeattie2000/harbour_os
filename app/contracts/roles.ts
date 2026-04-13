export type UserRoles =
  | 'admin'
  | 'operations_manager'
  | 'yard_manager'
  | 'billing_clerk'
  | 'inventory_controller'
  | 'gate_operator'
  | 'tally_clerk'
  | 'reefer_technician'
  | 'equipment_operator'
  | 'portal'

export type AccountRoles =
  | 'account_admin'
  | 'vessel_planner'
  | 'captain'
  | 'agent_user'
  | 'account_user'
  | 'account_readonly'
  | 'dispatcher'
  | 'slot_manager'

export type UserAndAccountRoles = UserRoles | AccountRoles;
