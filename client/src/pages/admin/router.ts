import { createRouter, createWebHistory } from 'vue-router';
import { createAuthGuard } from '@auth0/auth0-vue';
import HomeView from './components/Home.vue';
import UsersView from './components/users/index.vue';

const routes = [{
  path: '',
  name: 'home',
  component: HomeView,
  beforeEnter: createAuthGuard()
}, {
  path: '/users',
  name: 'users',
  component: UsersView,
  beforeEnter: createAuthGuard()
}];

export default createRouter({
  history: createWebHistory('/admin'),
  routes
});
