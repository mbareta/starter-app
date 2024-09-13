# Description

Server application written in Typescript with NestJS and MikroORM.

# Installation

```bash
$ npm install
```

## Auth0 Setup

If you have followed Auth0 setup from (here)[https://github.com/mbareta/starter-app/tree/master/client#setting-up-auth0],
you are ready to put those variables to .env.

AUTH0_AUDIENCE=[application URL - this was configured when setting up]
AUTH0_DOMAIN=[something.us.auth0.com]
AUTH0_CLIENT_ID=[copy from Auth0]
AUTH0_CLIENT_SECRET=[copy from Auth0]

## Env setup

Set these .env variables to get running easily.

DB_URL=postgresql://localhost/starter_app
TEST_DB_URL=postgresql://localhost/starter_app_test

Use these values if you have local Postgres server set up without the need for
username and password. Otherwise, add username and password to the connection URL.

# Running the app

```bash
# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

After starting the app in dev mode, visit http://localhost:3000

# Working with models

```bash
# create new migration
$ npx mikro-orm migration:create --name=custom-name

# apply the migration
$ npm run build
$ npx mikro-orm migration:up
```

# Test

```bash
# unit/integration tests
$ npm test

# test coverage
$ npm run test:cov
```

# Deployment

This directory contains Dockerfile for simple deployment as web server. It also
contains `compose.yaml` to simplify Docker build testing locally.

