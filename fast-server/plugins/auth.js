'use strict'

const fp = require('fastify-plugin')

module.exports = fp(async function (fastify, opts) {
  fastify.decorate('authorize', async function(request, reply) {
    const { allowedRoles } = request.routeOptions.config;
    if (!allowedRoles.includes(request.user.role)) {
      return reply.status(403).send('Unauthorized');
    }
  })
})
