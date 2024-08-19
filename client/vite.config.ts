import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'

// this middleware allows us to browser refresh in Vue Router WebHistory mode
// usually, Vite will try to load whatever path we put, but here we fall back
// to admin.html file which has built in vue router which routes the request to
// correct page
// if we want to add more pages to the app, we must add their rewrites here,
// next to the `/admin` rewrite
const rewrite = {
  name: 'mpa-rewrite-middleware',
  configureServer(serve) {
    serve.middlewares.use((req, _, next) => {
      if (req.url.startsWith('/admin')) req.url = '/admin';
      // TODO - find a better way to achieve this
      if (req.url === '/') req.url = '/';
      if (req.url.startsWith('/courses')) req.url = '/';
      next()
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
      public: '/src/pages/public'
    },
  },
})
