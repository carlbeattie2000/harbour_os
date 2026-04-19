import transmit from '@adonisjs/transmit/services/main'

transmit.authorize<{ id: string }>('notifications/users/:id', (ctx, { id }) => {
  return ctx.auth.user?.id === +id
})
