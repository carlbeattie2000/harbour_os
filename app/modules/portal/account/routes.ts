import { controllers } from '#generated/controllers'
import { middleware } from '#start/kernel'
import { throttle } from '#start/limiter'
import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.get('/:id/manage', [controllers.portal.account.ViewAccount, 'show'])
    router.get('/:id/users/add', [controllers.portal.account.AddUsers, 'create'])
    router.post('/:id/users/add', [controllers.portal.account.AddUsers, 'store'])
  })
  .use(middleware.auth())
  .use(middleware.account())
  .use(middleware.accountRole({ allowedRoles: 'account_admin' }))
  .use(throttle)
  .prefix('portal/account/')

router
  .group(() => {
    router.get('/:id', [controllers.portal.account.Dashboard, 'home'])
  })
  .use(middleware.auth())
  .use(middleware.account())
  .use(throttle)
  .prefix('portal/account/')
