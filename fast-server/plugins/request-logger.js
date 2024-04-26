'use strict'

const fp = require('fastify-plugin')

module.exports = fp(async function (fastify, opts) {
  fastify.addHook('onResponse', (request, reply, done) => {
    const data = {
      ip_address: request.ip,
      client_url: request.headers?.referer || null,
      server_url: request.originalUrl,
      status_code: reply.statusCode,
      params: request.params,
      query: request.query,
      method: request.method,
      datetime: new Date().toISOString(),
      duration: reply.elapsedTime,
      body: request.body || null
    };
    request.log.info(data);
    done();
  })
})
