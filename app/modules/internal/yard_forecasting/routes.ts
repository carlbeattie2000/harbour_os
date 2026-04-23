import { controllers } from '#generated/controllers'
import { middleware } from '#start/kernel'
import { throttle } from '#start/limiter'
import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.get('/', [controllers.internal.YardForecastings, 'forecast'])
  })
  .use(middleware.auth())
  .use(middleware.role({ allowedRoles: ['admin', 'yard_manager'] }))
  .use(throttle)
  .use(middleware.vpnOnly())
  .prefix('internal/yard-forecast')
