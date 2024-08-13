import auth0Config from '/src/constants/auth0';
import { createApp } from 'vue';
import { createAuth0 } from '@auth0/auth0-vue';
import router from './router';
import App from './App.vue';
import './styles/main.scss';

const app = createApp(App);

app.use(router);
app.use(createAuth0(auth0Config));

app.mount('#app');

export default app;
