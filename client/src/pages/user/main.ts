import './styles/main.scss';
import App from './App.vue';
import auth0Config from '/src/constants/auth0';
import { createApp } from 'vue';
import { createAuth0 } from '@auth0/auth0-vue';
import { createPinia } from 'pinia';
import router from './router';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(createAuth0(auth0Config));

app.mount('#app');

export default app;
