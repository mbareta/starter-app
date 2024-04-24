import { createRouter, createWebHistory } from 'vue-router';
import HomeView from './components/Home.vue';
import LoginView from './components/Login.vue';

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/login', name: 'login', component: LoginView }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
