'use strict'

const path = require('node:path')
const AutoLoad = require('@fastify/autoload')

// Pass --options via CLI arguments in command to enable these options.
const options = {
  disableRequestLogging: true
}

module.exports = async function (fastify, opts) {
  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({}, opts)
  })

  fastify.setErrorHandler((error, request, reply) => {
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
      body: request.body || null,
      error: {
        type: error.type,
        message: error.message,
        // stack: error.stack
      }
    };
    request.log.info(data);
    reply.status(500).send('Internal server error');
  })
}

module.exports.options = options
