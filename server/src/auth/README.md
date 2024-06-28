# Auth Module

This module handles user authentication. It depends on users service for access
to users repository (finding user from DB).

The controller has login function which authenticates user with email and
password that are stored in the database. Once authenticated the user is issued
a JWT token that is used to authenticate all other non-public endpoints.

## Decorators

- @Public decorator - skips auth in AuthGuard.
- @Roles decorator - only allows selected roles to access specific endpoint.

## AuthGuard

Extracts user payload from JWT and fetches user info from the DB and attaches it
to request object. AuthGuard is set as global APP_GUARD and can be bypassed by
decorating the controller endpoint with @Public() decorator.

## Controller endpoints

- POST /auth/login - extracts `email` and `password` from request body, performs
  authentication and  returns user profile object and JWT token.

- GET /auth/profile - returns current user profile.
