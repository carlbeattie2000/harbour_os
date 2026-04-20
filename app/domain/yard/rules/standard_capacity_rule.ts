import type { YardConflict, YardRuleContext } from '../../../contracts/yard_forecasting.ts'

export class StandardRule {
  check(ctx: YardRuleContext): YardConflict | null {
    const projected = ctx.counts.standard + ctx.baselineOccupancy + ctx.projectedNetFlow

    if (projected > ctx.totalCapacity) {
      return 'standard_capacity_exceeded'
    }

    return null
  }
}
