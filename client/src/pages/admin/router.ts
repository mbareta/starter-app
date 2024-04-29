import { createRouter, createWebHistory } from 'vue-router';
import HomeView from './components/Home.vue';
import UsersView from './components/users/index.vue';

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/users', name: 'users', component: UsersView }
]

export default createRouter({
  history: createWebHistory('/admin'),
  routes
})
