import edge from 'edge.js'

edge.global('hasRole', (user: { roles?: { slug: string }[] }, roles: string[]) => {
  return user.roles?.some((r) => roles.includes(r.slug)) ?? false
})
