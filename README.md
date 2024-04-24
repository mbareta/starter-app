# Web Application Starter App

## Description
The idea was to set up a preconfigured application with backend and frontend without
any business logic.
The application would have basic user auth, connection to DB and working frontend.


## Tech
- NestJS powered backend
- MikroORM models and DB queries
- Vue3 with Vite for frontend

## Contents
- `client` contains frontend files
- `server` contains backend files

Each directory contains its own README which explains how to set up, run
and contribute.

## Get Started Quickly

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

### Future Plans
- add Tailor connection
- allow multiple auth strategies (JWT, Auth0, ...)
- try setting up GraphQL
- try using Fastify as NestJS backend
- include CI/CD setup
