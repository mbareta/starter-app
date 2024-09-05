<script>
import { mapActions, mapState } from 'pinia';
import LoadingSpinner from 'public/components/common/LoadingSpinner.vue';
import Module from './Module.vue';
import { useCoursesStore } from 'public/stores/courses.store';

export default {
  props: { courseId: { type: Number, required: true } },
  computed: {
    ...mapState(useCoursesStore, ['courses', 'isLoading']),
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
    if (!this.course.id) return this.loadCourses();
  },
  components: { LoadingSpinner, Module }
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
    <loading-spinner :isLoading="isLoading" class="loading-spinner" />
    <section class="container">
      <module
        v-for="module in rootModules"
        :key="module.uid"
        :course="course"
        :module="module" />
    </section>
  </div>
</template>

<style lang="scss" scoped>
:deep(.loading-spinner) p {
  color: var(--bulma-scheme);
}
</style>
