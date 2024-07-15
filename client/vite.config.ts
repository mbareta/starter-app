import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  appType: 'mpa',
  build: {
    rollupOptions: {
      input: {
        public: resolve(__dirname, 'index.html'),
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
