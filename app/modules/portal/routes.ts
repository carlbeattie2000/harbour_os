import { controllers } from '#generated/controllers'
import { middleware } from '#start/kernel'
import { throttle } from '#start/limiter'
import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.get('login', [controllers.Session, 'create'])
    router.post('login', [controllers.Session, 'store'])

    router.get('/:slug/login', [controllers.Session, 'create']).as('createCompany')
    router.post('/:slug/login', [controllers.Session, 'store']).as('storeCompany')
  })
  .use(middleware.guest())
  .use(throttle)
  .prefix('portal')

router
  .group(() => {
    router.get('/', [controllers.portal.Dashboard, 'home']).as('portal.dashboard')
  })
  .use(middleware.auth())
  .use(middleware.role({ allowedRoles: 'portal' }))
  .use(throttle)
  .prefix('portal')
