'use strict';

const getAuthorizeRolesOptions = (fastify, allowedRoles) => {
  return {
    config: { allowedRoles },
    preHandler: fastify.authorize
  };
};

module.exports = { getAuthorizeRolesOptions }
