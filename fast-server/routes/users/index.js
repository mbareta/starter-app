'use strict'

module.exports = async function (fastify, opts) {
  fastify.addHook('preHandler', function (request, reply, done) {
    if (request.user.role === 'ADMIN') return done();
    return reply.status(403).send();
  })

  fastify.get('/', async function (request, reply) {
    const users = await this.prisma.user.findMany();
    return reply.send(users)
  })
}
