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
import '#modules/portal/account/routes'
import '#modules/containers/routes'
import '#modules/user/routes'
import '#modules/account/routes'

import '#modules/internal/routes'

import router from '@adonisjs/core/services/router'
import { throttle } from './limiter.ts'

router.on('/').render('pages/home').as('home').use(middleware.guest())

router
  .group(() => {
    router.post('logout', [controllers.Session, 'destroy'])
  })
  .use(middleware.auth())
  .use(throttle)
