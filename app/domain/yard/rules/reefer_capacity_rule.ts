import type { YardConflict, YardRuleContext } from '../../../contracts/yard_forecasting.ts'

export class ReeferRule {
  check(ctx: YardRuleContext): YardConflict | null {
    const projected = ctx.counts.reefer + ctx.baselineOccupancy + ctx.projectedNetFlow

    if (projected > ctx.totalCapacity) {
      return 'reefer_capacity_exceeded'
    }

    return null
  }
}
