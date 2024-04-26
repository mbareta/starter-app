'use strict'

module.exports = async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    const users = await this.prisma.user.findMany();
    return reply.send(users)
  })
}
