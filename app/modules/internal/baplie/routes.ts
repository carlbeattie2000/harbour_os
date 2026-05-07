import { controllers } from '#generated/controllers'
import { middleware } from '#start/kernel'
import { throttle } from '#start/limiter'
import router from '@adonisjs/core/services/router'
import type { UserRoles } from '../../../contracts/roles.ts'

const ALLOWED_USERS: UserRoles[] = ['admin', 'operations_manager', 'yard_manager']

router
  .group(() => {
    router.get('/upload', [controllers.internal.Baplies, 'create'])
    router.post('/', [controllers.internal.Baplies, 'store'])

    router.post('/confirm', [controllers.internal.Baplies, 'confirm'])
    router.post('/cancel', [controllers.internal.Baplies, 'cancel'])

    router.get('/find', [controllers.internal.Baplies, 'find'])
    router.get('/view/:voyageNumber', [controllers.internal.Baplies, 'view'])
  })
  .use(middleware.auth())
  .use(middleware.role({ allowedRoles: ALLOWED_USERS }))
  .use(middleware.vpnOnly())
  .use(throttle)
  .prefix('internal/baplie')
