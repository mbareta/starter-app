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

## Setting up Auth0

Create Auth0 account and create a new SPA Vue application. This Auth0 application
will be used for frontend authentication and its settings should be used in
frontend setup. Leave all of the settings default except the following:
- Allowed Callback URLs: `http://localhost:5173, http://localhost:5173/admin`
- Allowed Web Origins: `http://localhost:5173`

>screenshot here

Now that we have our application set up, let's add a new Auth0 API. Use the
default values and change this:
- Identifier: `http://localhost:3000`

>API screenshot here

After creating the API, go to `Machine To Machine Applications` tab and click
Authorize both app that we set up for Vue and "API Explorer Application". It is
necessary to authorize the API Explorer to be able to use ManagementClient to
fetch users and manage data from code.

>M2M screenshot here

Now we're ready to set .env variables like this:
- AUTH0_AUDIENCE=http://localhost:3000
- AUTH0_DOMAIN=<your Auth0 domain>
- AUTH0_CLIENT_ID=<your Auth0 Client ID>
- AUTH0_CLIENT_SECRET=<your Auth0 Client Secret>

That's it. We're ready to log in for the first time.

## Logging in for the first time

Notice that after logging in, we still cannot access any of the APIs. We need to
add a user with our email in DB. Easiest way to do it is a simple INSERT DB query.
