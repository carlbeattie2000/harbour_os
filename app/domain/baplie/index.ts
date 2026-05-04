import AppError from '#errors/app_error'
import {
  defineGroup,
  defineSchema,
  defineSegment,
  EdifactDocument,
  type MappedMessage,
} from 'neat-edifact-mapper'

class InvalidVoyageError extends AppError {
  constructor() {
    super('Invalid voyage', 'E_INVALID_VOYAGE', 422)
  }
}

class InvalidContainerPosition extends AppError {
  constructor() {
    super('Invalid container position', 'E_INVALID_CONTAINER_POSITION', 422)
  }
}

class InvalidFieldLengthError extends AppError {
  constructor(field: string, max: number, actual: number) {
    super(
      `Field ${field} exceeds maximum length of ${max}, got ${actual}`,
      'E_INVALID_FIELD_LENGTH',
      422
    )
  }
}

interface Container {
  number: string | undefined
  position: {
    bay: number
    row: number
    tier: number
  }
  isoSizeType: string | undefined
  hazmat: {
    class: string | undefined
    unNumber: string | undefined
  }
  reefer: {
    temperature: number | undefined
    unit: string | undefined
    min: number | undefined
    max: number | undefined
  }
}

interface Voyage {
  number: string
  containers: Container[]
}

export class Baplie {
  #raw: string

  constructor(baplieFileContent: string) {
    this.#raw = baplieFileContent
  }

  #schema(strict = true) {
    return defineSchema({
      items: [
        defineSegment('BGM', { required: true }),
        defineSegment('DTM', { required: true }),
        defineGroup({
          head: defineSegment('RFF', { required: true }),
          items: [defineSegment('DTM', { repeatable: 9 })],
        }),
        defineGroup({
          head: defineSegment('NAD', { required: true }),
          items: [
            defineGroup({
              head: defineSegment('CTA', { required: true }),
              items: [defineSegment('COM', { repeatable: 9 })],
            }),
          ],
        }),
        defineGroup({
          head: defineSegment('TDT', { required: true }),
          items: [
            defineSegment('LOC', { required: true, repeatable: 2 }),
            defineSegment('DTM', { required: true, repeatable: 99 }),
            defineSegment('RFF', {}),
            defineSegment('FTX', {}),
          ],
          required: true,
        }),
        defineGroup({
          head: defineSegment('LOC', { required: true }),
          items: [
            defineSegment('GID', { required: false }),
            defineSegment('GDS', { required: false }),
            defineSegment('FTX', { required: false, repeatable: 9 }),
            defineSegment('MEA', { required: true, repeatable: 9 }),
            defineSegment('DIM', { required: false, repeatable: 9 }),
            defineSegment('TMP', { required: false }),
            defineSegment('RNG', { required: false }),
            defineSegment('LOC', { required: false, repeatable: 9 }),
            defineSegment('RFF', { required: true }),
            defineGroup({
              head: defineSegment('EQD', { required: true }),
              items: [
                defineSegment('EQA', { required: false, repeatable: 9 }),
                defineSegment('NAD', { required: false, repeatable: 9 }),
                defineSegment('RFF', { required: false, repeatable: 9 }),
              ],
              repeatable: 3,
              required: false,
            }),
            defineGroup({
              head: defineSegment('DGS', { required: true }),
              items: [defineSegment('FTX', { required: false })],
              required: false,
              repeatable: 999,
            }),
          ],
          required: false,
          repeatable: 9999,
        }),
      ],
      strict,
    })
  }

  #validateFieldLength(value: string | undefined, field: string, max: number): string | undefined {
    if (value === undefined) return undefined
    if (value.length > max) throw new InvalidFieldLengthError(field, max, value.length)
    return value
  }

  #numberOrUndefined(value: string | undefined): number | undefined {
    const num = Number(value)

    return Number.isNaN(num) ? undefined : num
  }

  #extractVoyage(mappedMessage: MappedMessage): Voyage {
    const tdtGroup = mappedMessage.getGroup('TDT')
    const segment = tdtGroup?.getSegment('TDT')
    const voyageNumber = this.#validateFieldLength(
      segment?.getDataElement(1)?.Value,
      'voyageNumber',
      17
    )

    if (!voyageNumber) {
      throw new InvalidVoyageError()
    }

    return {
      number: voyageNumber,
      containers: [],
    }
  }

  #extractContainers(mappedMessage: MappedMessage, voyage: Voyage): Voyage {
    const locGroups = mappedMessage.getGroups('LOC')

    locGroups.forEach((group) => {
      const eqdGroup = group.getGroup('EQD')
      const eqd = eqdGroup?.getSegment('EQD')
      const containerNumber = eqd?.getDataElement(1)?.getComponent(0)?.value
      const isoSizeType = eqd?.getDataElement(2)?.getComponent(0)?.value

      const loc = group.getSegment('LOC')
      const position = loc?.getDataElement(1)?.getComponent(0)?.value

      const dgs = group.getSegment('DGS')
      const hazmatClass = dgs?.getDataElement(1)?.Value
      const hazmatUnNumber = dgs?.getDataElement(2)?.Value

      const tmp = group.getSegment('TMP')
      const temperature = tmp?.getDataElement(1)?.Value
      const unit = tmp?.getDataElement(2)?.getComponent(0)?.value

      const rng = group.getSegment('RNG')
      const min = rng?.getDataElement(1)?.getComponent(1)?.value
      const max = rng?.getDataElement(1)?.getComponent(1)?.value

      const bay = Number(position?.slice(0, 2))
      const row = Number(position?.slice(2, 4))
      const tier = Number(position?.slice(4, 6))

      if (Number.isNaN(bay) || Number.isNaN(row) || Number.isNaN(tier)) {
        throw new InvalidContainerPosition()
      }

      voyage.containers.push({
        number: containerNumber,
        position: {
          bay,
          row,
          tier,
        },
        isoSizeType,
        hazmat: {
          class: hazmatClass,
          unNumber: hazmatUnNumber,
        },
        reefer: {
          temperature: this.#numberOrUndefined(temperature),
          unit,
          min: this.#numberOrUndefined(min),
          max: this.#numberOrUndefined(max),
        },
      })
    })

    return voyage
  }

  public process(): Voyage {
    const document = EdifactDocument.useStrict().fromString(this.#raw, this.#schema())

    const mappedBaplieMessages = document.map()
    const mappedBaplieMessage = mappedBaplieMessages[0]

    const voyage = this.#extractVoyage(mappedBaplieMessage)
    this.#extractContainers(mappedBaplieMessage, voyage)

    return voyage
  }
}
