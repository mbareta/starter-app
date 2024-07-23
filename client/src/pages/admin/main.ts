import { createAuth0 } from '@auth0/auth0-vue';
import { createPinia } from 'pinia';
import router from './router';
import './styles/main.scss';
import app from './app';

const pinia = createPinia();
const auth0 = createAuth0({
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  authorizationParams: {
    redirect_uri: window.location.href,
    audience: import.meta.env.VITE_AUTH0_AUDIENCE
  }
});

app.use(pinia);
app.use(router);
app.use(auth0);

app.mount('#app');
