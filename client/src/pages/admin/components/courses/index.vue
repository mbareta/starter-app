<script>
import { mapActions, mapState } from 'pinia';
import Card from './Card.vue';
import CoursesList from './List.vue';
import { useCoursesStore } from 'admin/stores/courses.store';

export default {
  computed: mapState(useCoursesStore, ['catalog']),
  methods: mapActions(useCoursesStore, ['loadCatalog', 'loadCourses']),
  mounted() {
    return Promise.all([this.loadCatalog(), this.loadCourses()]);
  },
  components: { Card, CoursesList }
};
</script>

<template>
  <div>
    <section class="hero is-info is-medium">
      <div class="hero-body">
        <h1 class="title">Courses</h1>
        <h2 class="subtitle">Here we can import, update and delete courses.</h2>
      </div>
    </section>
    <section class="container">
      <h2 class="title">Available courses (course catalog)</h2>
      <div class="columns">
        <div
          v-for="course in catalog"
          :key="course.id"
          class="column is-half-tablet is-one-quarter-fullhd">
          <card :course="course" />
        </div>
      </div>
    </section>
    <section class="container">
      <h2 class="title">Imported courses</h2>
      <courses-list />
    </section>
  </div>
</template>

<style lang="scss" scoped>
section {
  margin-bottom: 4rem;
}
</style>
