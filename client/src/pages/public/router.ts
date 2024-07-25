import { createRouter, createWebHistory } from 'vue-router';
import { createAuthGuard } from '@auth0/auth0-vue';
import HomeView from './components/Home.vue';

const routes = [{
  path: '',
  name: 'home',
  component: HomeView,
  beforeEnter: createAuthGuard()
}];

export default createRouter({
  history: createWebHistory('/'),
  routes
})
