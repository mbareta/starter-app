'use strict'

module.exports = async function (fastify, opts) {
  fastify.post('/login', async function (request, reply) {
    const user = await this.prisma.user.findUnique({
      where: { email: request.body.email }
    });
    if (user.password === request.body.password) {
      const token = this.jwt.sign(user)
      return reply.send({ token });
    }
    return reply.status(400).send('Login failed');
  })
}
