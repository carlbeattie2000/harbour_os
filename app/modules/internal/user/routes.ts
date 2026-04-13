import { controllers } from '#generated/controllers'
import { middleware } from '#start/kernel'
import { throttle } from '#start/limiter'
import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.get('create', [controllers.CreateUsers, 'create'])
    router.post('/', [controllers.CreateUsers, 'store'])
    router.get(':id', [controllers.Users, 'show'])
  })
  .use(middleware.auth())
  .use(middleware.role({ allowedRoles: 'admin' }))
  .use(throttle)
  .prefix('users')
