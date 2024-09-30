# Web Application Starter App

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/mbareta/starter-app/tree/master.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/mbareta/starter-app/tree/master)

## Description
The idea was to set up a preconfigured application with backend and frontend without
any business logic.
The application would have basic user auth, connection to DB and working frontend.

## Requirements

Make sure you have the following installed, configured and running:

- Node 21 or higher
- Postgresql


## Tech

- NestJS powered backend
- MikroORM models and DB queries
- Vue3 with Vite for frontend

## Contents

- `client` contains frontend files
- `server` contains backend files
- `fast-server` is just a simple fastify server showing how we can create multiple
  backends in different technologies

Each directory contains its own README which explains how to set up, run
and contribute.

## Get Started Quickly

The apps need some setting up before first run. Check the steps to set up
[client](https://github.com/mbareta/starter-app/blob/master/client/README.md)
and steps to set up [server](https://github.com/mbareta/starter-app/blob/master/server/README.md)
first.

---

Run the server:

```bash
$ cd server
$ npm i
$ npx mikro-orm migration:up
$ npm run start:dev
```

Run the frontend:

```bash
$ cd client
$ npm i
$ npm run dev
```

Visit http://localhost:5173/

## CircleCI

This repo contains CircleCI config.yaml. The workflow is set up to test and lint
commits in pull requests and to test and build the app for commits on master
branch.

The project is currently built on my CircleCI account, but that can be easily
changed when the project is forked.

### Playwright in CircleCI

In order to run Playwright tests in CircleCI, we need to run client and server
so our browser can run tests. To be able to run client and server in the browser
we need to set correct environment variables.

That means we need to set the same variables in CircleCI as we have locally,
both in client and server apps. Those include server's Auth0 config (client ID,
secret, domain and audience), client's Auth0 config (client ID, domain and
audience), .env.e2e which contains user login credentials for the app and lastly
Docker credentials so our Docker image can be uploaded to Docker Hub.

## Caveats

### Registration

User management and registration was left unfinished. Currently, the users need
to be added to the DB so they can log in and work with the app. This mimics the
preregistration pattern where admin needs to create an account for the user.
But because different projects have different requirements, this part was left
open to easily change user registration flow and very little code needs to be
changed to implement a different registration process.

### CI/CD

Since we're setting up the generic "hello world" application, some things will
need changing before the first production deploy.

For example: the CircleCI is configured to build the Docker image and push it to
Docker Hub. In real world scenario, we might want to use AWS ECR orb to push
directly to AWS and deploy from there.

## Future Plans
- add infrastructure code (Pulumi)
- add OpenAPI documentation
- try setting up GraphQL
- try using Fastify as NestJS backend
- add simple chatbot
