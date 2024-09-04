<script>
import { mapActions, mapState } from 'pinia';
import Module from './Module.vue';
import { useCoursesStore } from 'public/stores/courses.store';

export default {
  props: { courseId: { type: Number, required: true } },
  computed: {
    ...mapState(useCoursesStore, ['courses']),
    course() {
      return this.courses.find(it => it.id === this.courseId) || {};
    },
    rootModules() {
      return (this.course.structure || [])
        .filter(it => it.parentId === null)
        .sort((a, b) => (a.position - b.position));
    }
  },
  methods: mapActions(useCoursesStore, ['loadCourses']),
  created() {
    return this.loadCourses();
  },
  components: { Module }
};
</script>

<template>
  <div>
    <section class="hero is-danger is-medium">
      <div class="hero-body">
        <h1 class="title">Welcome to {{ course.name }}!</h1>
        <h2 class="subtitle">{{ course.description }}</h2>
      </div>
    </section>
    <section class="container">
      <module
        v-for="module in rootModules"
        :key="module.uid"
        :course="course"
        :module="module" />
    </section>
  </div>
</template>
