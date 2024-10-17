import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'

// This middleware allows us to browser refresh in Vue Router WebHistory mode.
// Usually, Vite will try to load whatever path we put, but here we fall back
// to admin.html file which has built in vue router which routes the request to
// correct page.
// If we want to add more pages to the app, we must add their rewrites here,
// next to the `/admin` rewrite.
// For the "user" page, there is no prefix we can target (similar to `/admin`)
// because the app is running on root so we target any request that asks for
// text/html content type to have it fall back to index.html.
const rewrite = {
  name: 'mpa-rewrite-middleware',
  configureServer(serve) {
    serve.middlewares.use((req, _, next) => {
      if (req.url.startsWith('/admin')) {
        req.url = '/admin';
      } else if (req.headers.accept.includes('text/html')) {
        req.url = '/';
      }
      return next();
    })
  }
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), rewrite],
  appType: 'mpa',
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin.html'),
      },
    },
  },
  resolve: {
    alias: {
      admin: '/src/pages/admin',
      user: '/src/pages/user'
    },
  },
})
