import { createRouter, createWebHistory } from 'vue-router';
import HomeView from './components/Home.vue';
import LoginView from './components/Login.vue';
import UsersView from './components/users/index.vue';

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/users', name: 'users', component: UsersView }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
