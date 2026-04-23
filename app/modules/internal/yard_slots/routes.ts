import { controllers } from '#generated/controllers'
import { middleware } from '#start/kernel'
import { throttle } from '#start/limiter'
import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.get('/create', [controllers.internal.YardSlots, 'create'])
    router.post('/', [controllers.internal.YardSlots, 'store'])

    router.get('/', [controllers.internal.YardSlots, 'index'])
  })
  .use(middleware.auth())
  .use(middleware.role({ allowedRoles: 'admin' }))
  .use(middleware.vpnOnly())
  .use(throttle)
  .prefix('internal/yard_slots')
