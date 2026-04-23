import { controllers } from '#generated/controllers'
import { middleware } from '#start/kernel'
import { throttle } from '#start/limiter'
import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.get('create', [controllers.internal.CreateAccounts, 'create'])
    router.post('/', [controllers.internal.CreateAccounts, 'store'])
  })
  .use(middleware.auth())
  .use(middleware.role({ allowedRoles: ['admin', 'operations_manager'] }))
  .use(middleware.vpnOnly())
  .use(throttle)
  .prefix('account')
