import { controllers } from '#generated/controllers'
import { middleware } from '#start/kernel'
import { throttle } from '#start/limiter'
import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.get('/pending', [controllers.internal.Vessels, 'pending'])

    router.patch('/approve/:id', [controllers.internal.Vessels, 'approve'])
    router.patch('/deny/:id', [controllers.internal.Vessels, 'deny'])
  })
  .use(middleware.auth())
  .use(middleware.role({ allowedRoles: 'admin' }))
  .use(throttle)
  .prefix('internal/vessels')
