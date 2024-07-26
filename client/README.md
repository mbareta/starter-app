# Description

Frontend SPA with Vite and Vue3.

# Running the app

Run

```bash
$ npm run dev
```

and visit http://localhost:5173

# Building the app

Run

```bash
$ npm run build
```

Optionally run

```bash
$ npm run preview
```
to preview built files locally.

# Contributing

The app is set up as [MPA](https://vitejs.dev/config/shared-options.html#apptype).

Two separate pages are:
1. public - this is what most people will use and will contain auth pages
2. admin - space for admins to view data and make changes

Depending on the requirements, we can add new pages like "courseware",
"analytics", "metrics" or similar to keep pages slim and performant.

# Dependencies

1. Vue3 - gold standard for web apps
2. Vue Router - for handling routes within the app
3. Pinia - application state handler
4. Bulma - CSS
5. Axios - HTTP requests
6. Auth0-Vue - Auth0 user authentication for Vue

# Setting up Auth0

Create Auth0 account and create a new SPA Vue application. This Auth0 application
will be used for frontend authentication and its settings should be used in
frontend setup. Leave all of the settings default except the following:
- Allowed Callback URLs: `http://localhost:5173, http://localhost:5173/admin`
- Allowed Logout URLs: `http://localhost:5173, http://localhost:5173/admin`
- Allowed Web Origins: `http://localhost:5173`

Now we're ready to add the following to .env:
- VITE_AUTH0_DOMAIN=[your Auth0 domain, ie. dev-6akn28u2adtkauhz.us.auth0.com]
- VITE_AUTH0_CLIENT_ID=[your Auth0 client ID]
- VITE_AUTH0_AUDIENCE=http://localhost:3000
