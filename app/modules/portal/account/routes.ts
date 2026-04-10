import { controllers } from "#generated/controllers"
import { middleware } from "#start/kernel"
import { throttle } from "#start/limiter"
import router from "@adonisjs/core/services/router"

router
  .group(() => {
    router.get('/:id', [controllers.Accounts, 'show'])
  })
  .use(middleware.auth())
  .use(middleware.role(['account_admin']))
  .use(middleware.account())
  .use(throttle)
  .prefix('portal/account/')

