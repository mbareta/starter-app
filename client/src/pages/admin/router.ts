import { createRouter, createWebHistory } from 'vue-router';
import CoursesView from './views/courses/index.vue';
import { createAuthGuard } from '@auth0/auth0-vue';
import HomeView from './views/HomeView.vue';
import UsersView from './views/users/index.vue';

const routes = [{
  path: '',
  name: 'home',
  component: HomeView,
  beforeEnter: createAuthGuard()
}, {
  path: '/courses',
  name: 'courses',
  component: CoursesView,
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
