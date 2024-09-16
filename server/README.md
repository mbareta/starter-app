# Description

Server application written in Typescript with NestJS and MikroORM.

# Installation

```bash
$ npm install
```

## ENV setup

Set these .env variables to get running easily.

DB_URL=postgresql://localhost/starter_app
TEST_DB_URL=postgresql://localhost/starter_app_test

Use these values if you have local Postgres server set up without the need for
username and password. Otherwise, add username and password to the connection URL.

## Setting up Auth0

Create Auth0 account and create a new SPA Vue application. This Auth0 application
will be used for frontend authentication and its settings should be used in
frontend setup. Leave all of the settings default except the following:
- Allowed Callback URLs: `http://localhost:5173, http://localhost:5173/admin`
- Allowed Web Origins: `http://localhost:5173`

[![Screenshot-2024-07-25-at-16-26-52.png](https://i.postimg.cc/fTDcpFmN/Screenshot-2024-07-25-at-16-26-52.png)](https://postimg.cc/5jKQFss7)

Now that we have our application set up, let's add a new Auth0 API. Use the
default values and change this:
- Identifier: `http://localhost:3000`

[![Screenshot-2024-07-25-at-16-07-07.png](https://i.postimg.cc/gcRsf87v/Screenshot-2024-07-25-at-16-07-07.png)](https://postimg.cc/RqSwt64F)

After creating the API, go to `Machine To Machine Applications` tab and
Authorize both app that we set up for Vue and "API Explorer Application". It is
necessary to authorize the API Explorer to be able to use ManagementClient to
fetch users and manage data from code.

[![Screenshot-2024-07-25-at-16-09-40.png](https://i.postimg.cc/xdwHRFnB/Screenshot-2024-07-25-at-16-09-40.png)](https://postimg.cc/Y4xh2R4x)

Now we're ready to set .env variables like this:
- AUTH0_AUDIENCE=http://localhost:3000
- AUTH0_DOMAIN=[your Auth0 domain]
- AUTH0_CLIENT_ID=[your Auth0 Client ID]
- AUTH0_CLIENT_SECRET=[your Auth0 Client Secret]

That's it. We're ready to log in for the first time.

## Logging in for the first time

Notice that after logging in, we still cannot access any of the APIs. We need to
add a user with our email in DB. Easiest way to do it is a simple INSERT DB query.

```sql
INSERT INTO users (email, role) VALUES ('<your email>', 'ADMIN');
```

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

