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
import '#modules/portal/vessels/routes'
import '#modules/portal/port_calls/routes'

import '#modules/internal/routes'
import '#modules/internal/user/routes'
import '#modules/internal/accounts/routes'
import '#modules/internal/containers/routes'
import '#modules/internal/vessels/routes'
import '#modules/internal/yard_slots/routes'
import '#modules/internal/port_calls/routes'

import router from '@adonisjs/core/services/router'
import { throttle } from './limiter.ts'

router.on('/').render('pages/home').as('home').use(middleware.guest())

router
  .group(() => {
    router.post('logout', [controllers.Session, 'destroy'])
  })
  .use(middleware.auth())
  .use(throttle)
