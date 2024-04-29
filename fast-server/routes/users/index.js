'use strict'

const { getAuthorizeRolesOptions } = require('../../helpers/auth');

module.exports = async function (fastify, opts) {
  const options = getAuthorizeRolesOptions(fastify, ['ADMIN']);
  const schema = {
    body: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        password: { type: 'string' }
      }
    }
  };

  fastify.get('/', options, async function (request, reply) {
    return this.prisma.user.findMany();
  })

  fastify.post('/', { ...options, schema }, async function (request, reply) {
    return this.prisma.user.create({ data: request.body });
  })
}
