<script>
import { mapActions, mapGetters } from 'pinia';
import { useCoursesStore } from 'admin/stores/courses.store';

export default {
  props: {
    course: { type: Object, required: true }
  },
  computed: {
    ...mapGetters(useCoursesStore, ['isCourseImported']),
    isDisabled() {
      return this.isCourseImported(this.course.uid);
    }
  },
  methods: mapActions(useCoursesStore, ['importCourse'])
};
</script>

<template>
  <div :class="{ 'is-disabled': isDisabled }" class="card is-primary">
  <div class="card-image">
    <figure class="image is-4by3">
      <img
        src="https://bulma.io/assets/images/placeholders/1280x960.png"
        alt="Placeholder image"
      />
    </figure>
  </div>
  <div class="card-content">
    <div class="media">
      <div class="media-content">
        <p class="title is-4">{{ course.name }}</p>
        <p class="subtitle is-6">{{ course.description }}</p>
      </div>
    </div>
    <div class="content has-text-centered">
      <button
        @click="importCourse(course.id)"
        :disabled="isDisabled"
        class="button is-primary">
        Import Course
      </button>
    </div>
  </div>
</div>
</template>

<style lang="scss" scoped>
.card.is-disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

html[data-theme="light"] {
  .card.is-disabled {
    opacity: 0.5;
  }
}
</style>
