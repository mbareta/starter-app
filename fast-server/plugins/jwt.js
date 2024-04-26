'use strict'

const fp = require('fastify-plugin')

module.exports = fp(async function (fastify, opts) {
  fastify.register(require('@fastify/jwt'), { secret: 'test' })

  fastify.addHook('onRequest', async function(request, reply) {
    if (request.url === '/auth/login') return;
    const payload = await request.jwtVerify();
    try {
      const user = await this.prisma.user.findUnique({ where: { id: payload.id } })
      request.user = user;
      return user
    } catch {
      reply.status(401).send()
    }
  })
})
