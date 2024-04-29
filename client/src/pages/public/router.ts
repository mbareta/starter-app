import { createRouter, createWebHistory } from 'vue-router';
import LoginView from './components/Login.vue';

const routes = [
  { path: '/', name: 'login', component: LoginView }
]

export default createRouter({
  history: createWebHistory('/'),
  routes
})
