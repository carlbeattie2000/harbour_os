import env from '#start/env'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

const ALLOWED_VPNS = env
  .get('VPN_ALLOWED_IPS')
  .split(',')
  .map((ip) => ip.trim())

function ipInCidr(ip: string, cidr: string): boolean {
  if (!cidr.includes('/')) return ip === cidr

  const [range, bits] = cidr.split('/')
  const mask = ~(2 ** (32 - Number.parseInt(bits)) - 1)

  const toInt = (addr: string) =>
    addr.split('.').reduce((acc, octet) => (acc << 8) + Number.parseInt(octet), 0)

  return (toInt(ip) & mask) === (toInt(range) & mask)
}

export default class VpnOnlyMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const clientIp =
      ctx.request.header('x-forwarded-for')?.split(',')[0].trim() ??
      ctx.request.header('x-real-ip') ??
      ctx.request.ip()

    const allowed = ALLOWED_VPNS.some((allowedIp) => ipInCidr(clientIp!, allowedIp))

    if (!allowed) {
      return ctx.response.forbidden('Access denied: VPN only')
    }

    return await next()
  }
}
