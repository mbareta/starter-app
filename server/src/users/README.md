# Users Module

This module provides CRUD for User model. The API is HTTP REST compliant and
uses role-based authorization to only allow admin users to access the endpoints.

Users service is just a simple wrapper for users repository and handles DB
read/write.

## Users repository

This module is a simple wrapper of MikroORM EntityRepository.
Docs here: https://mikro-orm.io/api/knex/class/EntityRepository

## Controller endpoints

- GET /users - returns all users
- GET /users/:id - returns a user with corresponding ID
- POST /users - creates a new user (data format is defined in CreateUserDto)
- PUT /users/:id - updates a user in the DB with corresponding ID (data format is defined in UpdateUserDto)
- DELETE /users/:id - deletes a user from the DB (users are not soft-deleted)
