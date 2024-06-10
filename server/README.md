# Description

Server application written in Typescript with NestJS and MikroORM.

# Installation

```bash
$ npm install
```

# Running the app

```bash
# development
$ npm run start

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
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
