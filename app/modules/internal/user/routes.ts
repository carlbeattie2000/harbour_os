import { controllers } from '#generated/controllers'
import { middleware } from '#start/kernel'
import { throttle } from '#start/limiter'
import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.get('create', [controllers.internal.CreateUsers, 'create'])
    router.post('/', [controllers.internal.CreateUsers, 'store'])
    router.get(':id', [controllers.internal.Users, 'show'])
  })
  .use(middleware.auth())
  .use(middleware.role({ allowedRoles: 'admin' }))
  .use(middleware.vpnOnly())
  .use(throttle)
  .prefix('users')
