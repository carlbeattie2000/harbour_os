import { controllers } from '#generated/controllers'
import { middleware } from '#start/kernel'
import { throttle } from '#start/limiter'
import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.get('/create', [controllers.portal.Vessels, 'create'])
    router.post('/', [controllers.portal.Vessels, 'store'])
  })
  .use(middleware.auth())
  .use(middleware.account())
  .use(middleware.accountType('shipping_line'))
  .use(middleware.accountRole({ allowedRoles: ['account_admin', 'captain', 'vessel_planner'] }))
  .use(throttle)
  .prefix('portal/account/:id/vessels/')
