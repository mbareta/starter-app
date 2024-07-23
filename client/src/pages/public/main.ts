import { createApp } from 'vue';
import { createAuth0 } from '@auth0/auth0-vue';
import router from './router';
import './style.css';
import App from './App.vue';

const app = createApp(App);

app.use(router);
app.use(
  createAuth0({
    domain: import.meta.env.VITE_AUTH0_DOMAIN,
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
    authorizationParams: {
      redirect_uri: window.location.origin
    }
  })
);

app.mount('#app');

export default app;
