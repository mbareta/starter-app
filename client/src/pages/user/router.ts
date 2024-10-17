import { createRouter, createWebHistory } from 'vue-router';
import CoursesView from './components/courses/index.vue';
import CourseView from './components/courses/course/index.vue';
import { createAuthGuard } from '@auth0/auth0-vue';
import HomeView from './components/HomeView.vue';

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
  path: '/courses/:courseId',
  name: 'course',
  component: CourseView,
  beforeEnter: createAuthGuard(),
  props: route => ({ courseId: Number(route.params.courseId) })
}];

const router = createRouter({ history: createWebHistory('/'), routes });
router.beforeEach(to => {
  if (!to.fullPath.startsWith('/admin')) return true;
  window.location.replace('/admin');
  return false;
});

export default router;
