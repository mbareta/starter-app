# Description

Server application written in Typescript with NestJS and MikroORM.

# Installation

```bash
$ npm install
```

## ENV setup

Set these .env variables to get running easily.

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=starter_app_test

Use these values if you have local Postgres server set up without the need for
username and password. Otherwise, add username and password to the connection URL.

## Setting up Adobe Auth

If you have set up the client auth, then you just need to paste the ID and secret
into .env and you can start. For information about the client-side setup,
see [client/README.md](../client/README.md).


ADOBE_CLIENT_ID=<Adobe Application ID>
ADOBE_CLIENT_SECRET=<Adobe Application Secret>
ADOBE_REDIRECT_URI=http://localhost:5173


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
$ npx mikro-orm migration:create --blank

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

