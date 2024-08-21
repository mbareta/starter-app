<script>
export default {
  props: {
    course: { type: Object, required: true }
  },
  computed: {
    src() {
      return this.course?.meta?.posterImage ||
        'https://bulma.io/assets/images/placeholders/1280x960.png';
    }
  }
};
</script>

<template>
  <div class="card">
  <div class="card-image">
    <figure class="image is-4by3">
      <img :src="src" alt="Placeholder image">
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
      <router-link
        :to="{ name: 'course', params: { courseId: course.id } }"
        class="button is-primary">
        View Course
      </router-link>
    </div>
  </div>
</div>
</template>
