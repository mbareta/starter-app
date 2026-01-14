import { createRouter, createWebHistory } from 'vue-router';
import CoursesView from './views/courses/index.vue';
import CourseView from './views/courses/course/index.vue';
import { createAuthGuard } from '@auth0/auth0-vue';
import HomeView from './views/HomeView.vue';
import AudioStreamingDemo from './AudioStreamingDemo.vue';

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
}, {
  path: '/audio-streaming',
  name: 'audio-streaming',
  component: AudioStreamingDemo,
  beforeEnter: createAuthGuard()
}];

const router = createRouter({ history: createWebHistory('/'), routes });
router.beforeEach(to => {
  if (!to.fullPath.startsWith('/admin')) return true;
  window.location.replace('/admin');
  return false;
});

export default router;
