import { test } from '@japa/runner'
import iso6456_parser from '../../../app/utils/iso6456_parser.ts'
import iso6456_type_group_parser from '../../../app/utils/iso6456_type_group_parser.ts'
import iso6456_size_type_parser from '../../../app/utils/iso6456_size_type_parser.ts'

test.group('Utils iso6346 parser', () => {
  test('returns correct ISO6346 information extracted from CSQU3054383', async ({ assert }) => {
    const code = 'CSQU3054383'
    const ownerCode = 'CSQ'
    const category = 'U'
    const serial = '305438'
    const checkDigit = 3

    const extractedInformation = iso6456_parser(code)

    assert.equal(extractedInformation.ownerCode, ownerCode)
    assert.equal(extractedInformation.category, category)
    assert.equal(extractedInformation.serial, serial)
    assert.equal(extractedInformation.checkDigit, checkDigit)
  })

  test('throws when code is incorrect length', async ({ assert }) => {
    const code = 'CSQU305438'

    assert.throws(() => iso6456_parser(code))
  })

  test('throws when code format is incorrect', async ({ assert }) => {
    const code = 'CSQU305438Q'

    assert.throws(() => iso6456_parser(code))
  })

  test('throws when code check digit cannot be validated', async ({ assert }) => {
    const code = 'CSQU3054384'

    assert.throws(() => iso6456_parser(code))
  })

  test('returns type code description', async ({ assert }) => {
    const code = 'L5G1'
    const description = iso6456_type_group_parser(code)
    assert.equal(description, 'HIGH CUBE CONT.')
  })

  test('throws when invalid type code', async ({ assert }) => {
    const code = 'BBSW6'

    assert.throws(() => iso6456_type_group_parser(code))
  })

  test('returns type code description', async ({ assert }) => {
    const code = 'L5G1'
    const description = iso6456_size_type_parser(code)
    assert.equal(description, 'HIGH CUBE CONT.')
  })

  test('throws when invalid type code', async ({ assert }) => {
    const code = 'BBSW6'

    assert.throws(() => iso6456_size_type_parser(code))
  })
})
