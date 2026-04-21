import { YardForecastService } from '#services/yard_forecast_service'
import {
  addUserRoleToAccount,
  addUserToAccount,
  createAccount,
  createPortCall,
  createUser,
  createVessel,
  giveUserRole,
} from '#tests/helpers/models'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'
import { DateTime } from 'luxon'

test.group('Services yard forecast', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())

  const yardForecastService = new YardForecastService()

  test('getEstimatedNetContainerFlow returns correct net container flow across multiple port calls', async ({
    assert,
  }) => {
    const shippingLineAdmin = await createUser()
    await giveUserRole(shippingLineAdmin.id, 'portal')
    const shippingLineAccount = await createAccount('shipping_line')
    await addUserToAccount(shippingLineAdmin.id, shippingLineAccount.id)
    await addUserRoleToAccount(shippingLineAdmin.id, 'account_admin')
    const vessel = await createVessel(shippingLineAccount.id)

    const window = {
      from: DateTime.now(),
      to: DateTime.now().plus({ days: 40 }),
    }

    await createPortCall(
      vessel.imoNumber,
      'arrival',
      { standard: 600, reefer: 400, hazmat: 20, oversize: 0 },
      { standard: 300, reefer: 200, hazmat: 10, oversize: 5 }
    )
    await createPortCall(
      vessel.imoNumber,
      'arrival',
      { standard: 200, reefer: 100, hazmat: 10, oversize: 5 },
      { standard: 100, reefer: 50, hazmat: 5, oversize: 2 }
    )
    await createPortCall(
      vessel.imoNumber,
      'arrival',
      { standard: 400, reefer: 200, hazmat: 15, oversize: 3 },
      { standard: 150, reefer: 80, hazmat: 8, oversize: 1 }
    )
    await createPortCall(
      vessel.imoNumber,
      'arrival',
      { standard: 300, reefer: 150, hazmat: 12, oversize: 2 },
      { standard: 120, reefer: 60, hazmat: 6, oversize: 3 }
    )

    const netFlow = await yardForecastService.getEstimatedNetContainerFlow(window.from, window.to)

    assert.equal(netFlow, 1317)
  })
})
