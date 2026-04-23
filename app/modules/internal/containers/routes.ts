import { controllers } from '#generated/controllers'
import { middleware } from '#start/kernel'
import { throttle } from '#start/limiter'
import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.get('create', [controllers.internal.Containers, 'create'])
    router.get('/', [controllers.internal.Containers, 'store'])
  })
  .use(middleware.auth())
  .use(middleware.role({ allowedRoles: 'admin' }))
  .use(middleware.vpnOnly())
  .use(throttle)
  .prefix('containers')
