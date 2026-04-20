import type { YardConflict, YardRuleContext } from '../../../contracts/yard_forecasting.ts'

export class HazmatRule {
  check(ctx: YardRuleContext): YardConflict | null {
    const projected = ctx.counts.hazmat + ctx.baselineOccupancy + ctx.projectedNetFlow

    if (projected > ctx.totalCapacity) {
      return 'hazmat_capacity_exceeded'
    }

    return null
  }
}
