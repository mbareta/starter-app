# Auth Module

This module handles user authentication. It depends on users service for access
to users repository (finding user from DB).

The authentication is handled by Adobe ALM. Frontend will redirect user to Adobe
which will redirect the user back after successful authentication. The URL will
contain `code` search param which will be sent to our backend to obtain access
and refresh tokens for that user.

Also, the backend will fetch the user information from Adobe (ie., email address)
and create the user in our database so we don't need to pull user profile from
Adobe each time (user profile API is throttled).

Each request to the backend will have to verify the access token which will ping
the Adobe servers to check user ID and account ID.

## Decorators

- @Public decorator - skips auth in AuthGuard.
- @Roles decorator - only allows selected roles to access specific endpoint.

## AuthGuard

Verifies access token in ALM and fetches the user from the DB and attaches that model
to the request object as `request.user`. AuthGuard is set as global APP_GUARD
and can be bypassed by decorating the controller endpoint with @Public()
decorator.

First step is to verify JWT and get the `user_id` and `account_id`
(unique identifier for that account in Adobe) from that response.
Then, we try to find the user in DB with that combination.
If the user is not found, it means they haven't logged in before so
we get user profile from ALM to retrieve email address. With that email
address (along with user ID and account ID), we create a new User database entry.


## Controller endpoints

- GET /auth/profile - returns current user profile.

## Tests

Auth Guard is mocked in tests to avoid requests to Adobe. For convenience sake,
we set user's email address as `Authorization` HTTP header and simply fetch that
user from the DB with their email address. This allows simple user seeding and
mocking and we don't need to test security aspects of Adobe.
