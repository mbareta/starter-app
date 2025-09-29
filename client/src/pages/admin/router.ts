import { createRouter, createWebHistory } from 'vue-router';
import CoursesView from './views/courses/index.vue';
import HomeView from './views/HomeView.vue';
import UsersView from './views/users/index.vue';
import { useAuthStore } from './stores/auth.store';

const createAuthGuard = () => {
  return async (to, _from, next) => {
    const code: string = to.query.code as string;
    if (code) await useAuthStore().login(code);
    if (useAuthStore().isLoggedIn) return next();
    const adobeAuthorizeUrl = 'https://learningmanager.adobe.com/oauth/o/authorize';
    const adobeClientId = import.meta.env.VITE_ADOBE_CLIENT_ID;
    const adobeRedirectUri = import.meta.env.VITE_ADOBE_REDIRECT_URI;
    const authorizeUrl = `${adobeAuthorizeUrl}?client_id=${adobeClientId}&redirect_uri=${adobeRedirectUri}&scope=learner:write&response_type=CODE`;
    window.location.replace(authorizeUrl);
  }
};

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
