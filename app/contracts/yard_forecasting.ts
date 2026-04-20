import type { DateTime } from 'luxon'

export type YardSlotType = 'reefer' | 'hazmat' | 'standard' | 'oversize'

export type YardConflict =
  | 'capacity_exceeded'
  | 'reefer_capacity_exceeded'
  | 'hazmat_capacity_exceeded'
  | 'oversize_capacity_exceeded'
  | 'standard_capacity_exceeded'

export interface YardConflictResult {
  hasConflicts: boolean
  conflicts: YardConflict[]
}

export interface ContainerTypes {
  standard: number
  reefer: number
  hazmat: number
  oversize: number
}

export interface YardRuleContext {
  eta: DateTime
  etd: DateTime

  counts: ContainerTypes

  baselineOccupancy: number

  totalCapacityByType: ContainerTypes

  projectedNetFlow: number
}

export interface ConstraintRule {
  name: string
  check(input: YardRuleContext): Promise<string | null>
}
