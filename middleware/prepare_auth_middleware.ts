import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class PrepareAuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */
    ctx.request.request.headers['authorization'] = `Bearer ${ctx.request.cookie('LoginToken')}`
    return next()
  }
}
