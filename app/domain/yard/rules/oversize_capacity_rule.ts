import type { YardConflict, YardRuleContext } from '../../../contracts/yard_forecasting.ts'

export class OversizeRule {
  check(ctx: YardRuleContext): YardConflict | null {
    const projected = ctx.counts.oversize + ctx.baselineOccupancy + ctx.projectedNetFlow

    if (projected > ctx.totalCapacityByType.oversize) {
      return 'oversize_capacity_exceeded'
    }

    return null
  }
}
