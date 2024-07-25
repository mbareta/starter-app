# Auth Module

This module handles user authentication. It depends on users service for access
to users repository (finding user from DB).

The authentication is handled by Auth0. Frontend will redirect user to Auth0 and
after successful authentication, the frontend will be able to generate JWT
tokens with Auth0 signature. Auth guard will verify that JWT in Auth0 and fetch
the user from the DB and attach the user object to the request.
Auth0 is only used for authentication and authorization is role-based within
this app.

## Decorators

- @Public decorator - skips auth in AuthGuard.
- @Roles decorator - only allows selected roles to access specific endpoint.

## AuthGuard

Verifies JWT in Auth0 and fetches the user from the DB and attaches that model
to the request object as `request.user`. AuthGuard is set as global APP_GUARD
and can be bypassed by decorating the controller endpoint with @Public()
decorator.

First step is to verify JWT and get the `sub` (unique identifier for that
account in Auth0) from that response. Then, we try to find the user in DB with
that sub. If the user is not found, it means they haven't logged in before so
we get user profile from Auth0 to retrieve email address. With that email
address, we try to find the user once again. If the user is not found, we give
up. If the user is found, we update `sub` in DB so next time we can find them
without fetching user profile from Auth0.


## Controller endpoints

- GET /auth/profile - returns current user profile.

## Tests

Auth Guard is mocked in tests to avoid requests to Auth0. For convenience sake,
we set user's email address as `Authorization` HTTP header and simply fetch that
user from the DB with their email address. This allows simple user seeding and
mocking and we don't need to test security aspects of Auth0.
