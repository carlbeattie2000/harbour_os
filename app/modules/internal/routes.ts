import { controllers } from '#generated/controllers'
import { middleware } from '#start/kernel'
import { throttle } from '#start/limiter'
import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.get('/', [controllers.internal.Dashboard, 'home']).as('internal.dashboard.home')
  })
  .use(middleware.auth())
  .use(middleware.role({ disallowedRoles: 'portal' }))
  .use(middleware.vpnOnly())
  .use(throttle)
  .prefix('internal')
