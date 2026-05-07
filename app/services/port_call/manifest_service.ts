import { type BaplieContainer } from '#domain/baplie/index'
import type PortCall from '#models/port_call'
import MathExtended from '#utils/math'
import { type TransactionClientContract } from '@adonisjs/lucid/types/database'
import { assertValidTransition } from '../../state_machines/index.ts'
import { PORT_CALL_TRANSITIONS } from '../../state_machines/port_call.ts'

const INCREASE_BY_FLAG = 15

type HandleUpdateFromStowagePlansResult = { status: 'success' } | { status: 'flagged' }

export class ManifestService {
  async #handleIncreaseFlag(portCall: PortCall, trx: TransactionClientContract) {
    assertValidTransition(PORT_CALL_TRANSITIONS, portCall.status, 'under_review')

    portCall.status = 'under_review'

    await portCall.useTransaction(trx).save()
  }

  async handleUpdateFromStowagePlans(
    portCall: PortCall,
    containers: BaplieContainer[],
    trx: TransactionClientContract
  ): Promise<HandleUpdateFromStowagePlansResult> {
    await portCall.useTransaction(trx).load('manifest')
    const manifest = portCall.manifest

    let standard = 0
    let reefer = 0
    let hazmat = 0

    for (const container of containers) {
      if (container.reefer.temperature && container.hazmat.class) {
        reefer += 1
        hazmat += 1
      } else if (container.reefer.temperature) {
        reefer += 1
      } else if (container.hazmat.class) {
        hazmat += 1
      } else {
        standard += 1
      }
    }

    const standardChangePercent = MathExtended.percentageChange(
      manifest.estimatedUnloadStandard,
      standard
    )
    const reeferChangePercent = MathExtended.percentageChange(
      manifest.estimatedUnloadReefer,
      reefer
    )
    const hazmatChangePercent = MathExtended.percentageChange(
      manifest.estimatedUnloadHazmat,
      hazmat
    )

    const flagAsNeedingReview =
      standardChangePercent >= INCREASE_BY_FLAG ||
      reeferChangePercent >= INCREASE_BY_FLAG ||
      hazmatChangePercent >= INCREASE_BY_FLAG

    if (flagAsNeedingReview) {
      await this.#handleIncreaseFlag(portCall, trx)
    }

    manifest.estimatedUnloadStandard = standard
    manifest.estimatedUnloadReefer = reefer
    manifest.estimatedUnloadHazmat = hazmat

    await manifest.useTransaction(trx).save()

    return flagAsNeedingReview ? { status: 'flagged' } : { status: 'success' }
  }
}
