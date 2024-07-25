import { createRouter, createWebHashHistory } from 'vue-router';
import clerk from 'admin/helpers/clerk';
import HomeView from './components/Home.vue';
import UsersView from './components/users/index.vue';

const routes = [{
  path: '/',
  name: 'home',
  component: HomeView,
  beforeEnter: () => {
    if (clerk.user) return true;
    clerk.openSignIn();
  }
}, {
  path: '/users',
  name: 'users',
  component: UsersView
}];

export default createRouter({
  history: createWebHashHistory('/admin'),
  routes
});
