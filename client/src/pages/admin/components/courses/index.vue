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
    <section class="container columns">
      <div v-for="course in catalog" :key="course.id" class="column is-3">
        <card :course="course" />
      </div>
    </section>
    <section class="container">
      <courses-list />
    </section>
  </div>
</template>
