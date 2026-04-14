import { controllers } from '#generated/controllers'
import { middleware } from '#start/kernel'
import { throttle } from '#start/limiter'
import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.get('/pending', [controllers.internal.Vessels, 'pending'])
    router.get('/complete-verification/:id', [controllers.internal.Vessels, 'completeVerification'])
  })
  .use(middleware.auth())
  .use(middleware.role({ allowedRoles: 'admin' }))
  .use(throttle)
  .prefix('internal/vessels')
