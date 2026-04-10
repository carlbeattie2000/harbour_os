import { controllers } from "#generated/controllers"
import { middleware } from "#start/kernel"
import { throttle } from "#start/limiter"
import router from "@adonisjs/core/services/router"

router
  .group(() => {
    router.get('create', [controllers.CreateAccounts, 'create'])
    router.post('/', [controllers.CreateAccounts, 'store'])
  })
  .use(middleware.auth())
  .use(middleware.role(['admin', 'operations_manager']))
  .use(throttle)
  .prefix('account')

