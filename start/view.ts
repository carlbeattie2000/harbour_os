import edge from 'edge.js'

edge.global('hasRole', (user: { roles?: { slug: string }[] }, roles: string[]) => {
  return user.roles?.some((r) => roles.includes(r.slug)) ?? false
})

edge.global('hasAccountRole', (user: { accountRoles?: { slug: string }[] }, roles: string[]) => {
  return user.accountRoles?.some((r) => roles.includes(r.slug)) ?? false
})
