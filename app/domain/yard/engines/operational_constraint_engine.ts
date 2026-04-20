import type { YardConflict, YardRuleContext } from '../../../contracts/yard_forecasting.ts'
import { HazmatRule } from '../rules/hazmat_capacity_rule.ts'
import { OversizeRule } from '../rules/oversize_capacity_rule.ts'
import { ReeferRule } from '../rules/reefer_capacity_rule.ts'
import { StandardRule } from '../rules/standard_capacity_rule.ts'

export class OperationalConstraintEngine {
  private rules = [new StandardRule(), new ReeferRule(), new HazmatRule(), new OversizeRule()]

  run(context: YardRuleContext): YardConflict[] {
    const results = this.rules.map((rule) => rule.check(context))
    return results.filter(Boolean) as YardConflict[]
  }
}
