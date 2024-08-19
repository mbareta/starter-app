<script>
import { mapActions, mapState } from 'pinia';
import Structure from './Structure.vue';
import { useCoursesStore } from 'public/stores/courses.store';

export default {
  props: { courseId: { type: Number, required: true } },
  computed: {
    ...mapState(useCoursesStore, ['courses']),
    course() {
      return this.courses.find(it => it.id === this.courseId) || {};
    }
  },
  methods: mapActions(useCoursesStore, ['loadCourses']),
  created() {
    return this.loadCourses();
  },
  components: { Structure }
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
      <structure :structure="course.structure" />
    </section>
  </div>
</template>
