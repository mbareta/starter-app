'use strict'

module.exports = async function (fastify, opts) {
  fastify.get('/healthcheck', async function () {
    return this.prisma.$queryRaw`SELECT 1`
  })
}
