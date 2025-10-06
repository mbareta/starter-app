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

# Linter

We currently have eslint set up with Vue3 recommended rules. I didn't like some
rules so I disabled them. See full config in `eslint.config.js`.

# Tests

E2E tests are written for Playwright. Running Playwright will automatically run
both client and server processes so there is no need to run the app before testing.

Running tests:

```bash
$ npm test
```

# Contributing

The app is set up as [MPA](https://vitejs.dev/config/shared-options.html#apptype).

Two separate pages are:
1. user - this is what most people will use and will contain auth pages
2. admin - space for admins to view data and make changes

Depending on the requirements, we can add new pages like "courseware",
"analytics", "metrics" or similar to keep pages slim and performant.

# Dependencies

1. Vue3 - gold standard for web apps
2. Vue Router - for handling routes within the app
3. Pinia - application state handler
4. Bulma - CSS
5. Axios - HTTP requests

# Setting up Adobe Authentication

Log in as Adobe ALM Integration Admin and go to Applications page.
Click "Register" and fill out Application Name and URL with anything.
Redirect domains should include our application URL and/or
`http://localhost:5173`. Check that you have the correct scopes and save. You
will be able to copy the Application ID and fill out .env like this:
```
VITE_ADOBE_CLIENT_ID=<client ID>
VITE_ADOBE_REDIRECT_URI=http://localhost:5173
```
