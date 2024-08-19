<script>
import { mapActions, mapState } from 'pinia';
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
  }
};
</script>

<template>
  <div>
    <section class="hero is-danger is-large">
      <div class="hero-body">
        <h1 class="title">Welcome to {{ course.name }}!</h1>
        <h2 class="subtitle">{{ course.description }}</h2>
      </div>
    </section>
    <section class="container">
      <div v-for="item in course.structure" :key="item.id" class="box">
        {{ item }}
      </div>
    </section>
  </div>
</template>

<script lang="scss" scoped>

</script>
