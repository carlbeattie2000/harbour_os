import type { DateTime } from 'luxon'

import PortCall from '#models/port_call'
import YardSlot from '#models/yard_slot'
import ContainerVisit from '#models/container_visit'

import { OperationalConstraintEngine } from '#domain/yard/engines/operational_constraint_engine'

import type { PortCallStatus } from '../contracts/port_call.ts'
import type {
  ContainerTypes,
  YardConflictResult,
  YardRuleContext,
  YardSlotType,
} from '../contracts/yard_forecasting.ts'

export class YardForecastService {
  async getEstimatedNetContainerFlow(from: DateTime, to: DateTime): Promise<number> {
    const ignoreStatuses: PortCallStatus[] = [
      'pending',
      'awaiting_account_approval',
      'canceled',
      'departed',
    ]

    const result = await PortCall.query()
      .whereNotIn('status', ignoreStatuses)
      .where((query) => {
        query.where('eta', '>=', from.toSQL() ?? '').andWhere('etd', '<=', to.toSQL() ?? '')
      })
      .preload('manifest')
      .exec()

    const portCallsInboundContainerCount = result.reduce(
      (sum, pc) => sum + (pc.manifest.estimatedUnload ?? 0),
      0
    )
    const portCallsOutboundContainerCount = result.reduce(
      (sum, pc) => sum + (pc.manifest.estimatedLoad ?? 0),
      0
    )

    return portCallsInboundContainerCount - portCallsOutboundContainerCount
  }

  async getInYardContainerCountAtTime(
    ignoreIfLeaveBefore: DateTime,
    containerType?: YardSlotType
  ): Promise<number> {
    const query = ContainerVisit.query()
      .where('status', 'in_yard')
      .where((qb) => {
        qb.whereNull('storageEnds').orWhere('storageEnds', '>', ignoreIfLeaveBefore.toSQL() ?? '')
      })

    if (containerType) {
      query.whereHas('container', (containerQuery) => {
        containerQuery.where('type', containerType)
      })
    }

    const result = await query.count('* as total').first()

    return Number(result?.$extras.total || 0)
  }

  async getTotalContainerStorageSlots(type: YardSlotType): Promise<number> {
    const yardSlotsCountResult = await YardSlot.query()
      .where('type', type)
      .andWhere('status', 'available')
      .count('* as total')
      .first()
    return Number(yardSlotsCountResult?.$extras.total || 0)
  }

  async getTotalContainerStorageCapacity(type?: YardSlotType): Promise<number> {
    const query = YardSlot.query().andWhere('status', 'available')

    if (type) {
      query.where('type', type)
    }

    const result = await query.sum('max_stack_height as total_capacity').first()

    return Number(result?.$extras.total_capacity || 0)
  }

  async simulateYardOccupancy(eta: DateTime, etd: DateTime): Promise<number> {
    const baseline = await this.getInYardContainerCountAtTime(eta)
    const netFlow = await this.getEstimatedNetContainerFlow(eta, etd)
    return baseline + netFlow
  }

  async checkPortCallCapacityFeasibility(
    eta: DateTime,
    etd: DateTime,
    inboundContainers: number,
    outboundContainers: number
  ): Promise<YardConflictResult> {
    const occupancy = await this.simulateYardOccupancy(eta, etd)
    const newPortCallDelta = inboundContainers - outboundContainers
    const projectedOccupancy = occupancy + newPortCallDelta
    const capacity = await this.getTotalContainerStorageCapacity()

    if (projectedOccupancy > capacity) {
      return {
        hasConflicts: true,
        conflicts: ['capacity_exceeded'],
      }
    }

    return {
      hasConflicts: false,
      conflicts: [],
    }
  }

  async checkPortCallOperationalConstraints(
    eta: DateTime,
    etd: DateTime,
    counts: ContainerTypes
  ): Promise<YardConflictResult> {
    const baselineOccupancy = await this.getInYardContainerCountAtTime(eta)
    const projectedNetFlow = await this.getEstimatedNetContainerFlow(eta, etd)

    const totalStandardCapacity = await this.getTotalContainerStorageCapacity('standard')
    const totalReeferCapacity = await this.getTotalContainerStorageCapacity('reefer')
    const totalOversizeCapacity = await this.getTotalContainerStorageCapacity('oversize')
    const totalHazmatCapacity = await this.getTotalContainerStorageCapacity('hazmat')

    const ctx: YardRuleContext = {
      eta,
      etd,
      counts,
      baselineOccupancy,
      projectedNetFlow,
      totalCapacityByType: {
        standard: totalStandardCapacity,
        reefer: totalReeferCapacity,
        hazmat: totalHazmatCapacity,
        oversize: totalOversizeCapacity,
      },
    }

    const operationalConstraintEngine = new OperationalConstraintEngine()
    const conflicts = operationalConstraintEngine.run(ctx)

    return {
      hasConflicts: conflicts.length > 0,
      conflicts,
    }
  }
}
