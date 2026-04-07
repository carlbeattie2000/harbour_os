/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import '#modules/portal/routes'
import router from '@adonisjs/core/services/router'
import { throttle } from './limiter.ts'

router.on('/').render('pages/home').as('home')

router
  .group(() => {
    router.post('logout', [controllers.Session, 'destroy'])
  })
  .use(middleware.auth())
  .use(throttle)
