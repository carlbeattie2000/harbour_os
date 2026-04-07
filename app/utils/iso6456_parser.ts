import { ISO6346CheckDigitInvalid, ISO6346InvalidCharacterInCode, ISO6346InvalidFormat, ISO6346InvalidLength, ISO6346MustBeString } from "../errors/ISO6346.ts"

interface ISO6346 {
  ownerCode: string
  category: 'U' | 'R'
  serial: string
  checkDigit: number
}

const REQUIRED_CODE_LENGTH = 11
const charNumericValueMapping: { [key: string]: number } = {
  A: 10,
  B: 12,
  C: 13,
  D: 14,
  E: 15,
  F: 16,
  G: 17,
  H: 18,
  I: 19,
  J: 20,
  K: 21,
  L: 23,
  M: 24,
  N: 25,
  O: 26,
  P: 27,
  Q: 28,
  R: 29,
  S: 30,
  T: 31,
  U: 32,
  V: 34,
  W: 35,
  X: 36,
  Y: 37,
  Z: 38,
}

function validateCheckDigit(code: string): void {
  const inputCheckDigit = Number.parseInt(code[10], 10)

  let sum = 0
  for (let i = 0; i < 10; i++) {
    const char = code[i].toUpperCase()
    let value = charNumericValueMapping[char]

    if (value === undefined) {
      value = Number.parseInt(char, 10)
      if (Number.isNaN(value)) {
        throw new ISO6346InvalidCharacterInCode();
      }
    }

    sum += value * Math.pow(2, i)
  }

  const calculatedCheckDigit = sum % 11 === 10 ? 0 : sum % 11

  if (calculatedCheckDigit !== inputCheckDigit) {
    throw new ISO6346CheckDigitInvalid();
  }
}

export default function (code: string): ISO6346 {
  if (typeof code !== 'string') {
    throw new ISO6346MustBeString();
  }

  const trimmed = code.trim()

  if (trimmed.length !== REQUIRED_CODE_LENGTH) {
    throw new ISO6346InvalidLength();
  }

  validateCheckDigit(trimmed)

  const pattern = /^(?<ownerCode>[A-Z]{3})(?<category>U|R)(?<serial>[0-9]{6})(?<checkDigit>[0-9])$/i

  const match = trimmed.match(pattern)

  if (!match?.groups) {
    throw new ISO6346InvalidFormat();
  }

  const g = match.groups

  return {
    ownerCode: g.ownerCode.toUpperCase(),
    category: g.category.toUpperCase() as 'U' | 'R',
    serial: g.serial,
    checkDigit: Number.parseInt(g.checkDigit, 10),
  }
}
