<script setup>
import Card from './Card.vue';
import { onMounted } from 'vue';
import { useCoursesStore } from 'public/stores/courses.store';

const store = useCoursesStore();
onMounted(() => store.loadCourses());
</script>

<template>
  <div>
    <section class="hero is-danger is-large">
      <div class="hero-body">
        <h1 class="title">Welcome!</h1>
        <h2 class="subtitle">Choose from the list of courses.</h2>
      </div>
    </section>
    <section class="container">
      <h2 class="title">Available Courses</h2>
      <div class="columns">
        <div
          v-for="course in store.courses"
          :key="course.id"
          class="column is-half-tablet is-one-quarter-fullhd">
          <card :course="course" />
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
section {
  margin-bottom: 4rem;
}
</style>
