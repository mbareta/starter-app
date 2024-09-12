<script>
import { mapActions, mapState } from 'pinia';
import Card from './Card.vue';
import CoursesList from './List.vue';
import LoadingSpinner from 'admin/components/common/LoadingSpinner.vue';
import { useCoursesStore } from 'admin/stores/courses.store';

export default {
  components: { Card, CoursesList, LoadingSpinner },
  computed: mapState(useCoursesStore,
    ['catalog', 'isLoadingCatalog', 'isLoadingCourses']),
  mounted() {
    return Promise.all([this.loadCatalog(), this.loadCourses()]);
  },
  methods: mapActions(useCoursesStore,
    ['deleteCourse', 'loadCatalog', 'loadCourses'])
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
      <loading-spinner :is-loading="isLoadingCatalog" class="loading-spinner" />
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
      <loading-spinner :is-loading="isLoadingCourses" class="loading-spinner" />
      <courses-list v-if="!isLoadingCourses" @destroy="deleteCourse" />
    </section>
  </div>
</template>

<style lang="scss" scoped>
section {
  margin-bottom: 4rem;
}

.loading-spinner {
  margin: auto;
  padding: 2rem;
}

:deep(.loading-spinner) p {
  color: var(--bulma-scheme);
}
</style>
