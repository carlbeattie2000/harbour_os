import { controllers } from '#generated/controllers'
import { middleware } from '#start/kernel'
import { throttle } from '#start/limiter'
import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.get('/create', [controllers.portal.PortCalls, 'create'])
    router.post('/', [controllers.portal.PortCalls, 'store'])
  })
  .use(middleware.auth())
  .use(middleware.account())
  .use(middleware.accountType('shipping_line'))
  .use(middleware.accountRole({ allowedRoles: ['account_admin', 'vessel_planner'] }))
  .use(throttle)
  .prefix('portal/account/:id/port-call/')
