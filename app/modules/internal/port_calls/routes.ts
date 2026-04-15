import { controllers } from '#generated/controllers'
import { middleware } from '#start/kernel'
import { throttle } from '#start/limiter'
import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.get('/pending', [controllers.internal.PortCalls, 'pending'])

    router.patch('/:id/approve', [controllers.internal.PortCalls, 'approve'])
    router.patch('/:id/deny', [controllers.internal.PortCalls, 'deny'])
  })
  .use(middleware.auth())
  .use(middleware.role({ allowedRoles: 'admin' }))
  .use(throttle)
  .prefix('internal/port-calls')
