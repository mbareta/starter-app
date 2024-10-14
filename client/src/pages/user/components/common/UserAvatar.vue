<script>
export default {
  props: {
    user: { type: Object, default: () => ({}) }
  },
  computed: {
    imageUrl() {
      return this.user?.value?.picture;
    }
  }
};
</script>

<template>
  <div class="is-spaced-between">
    <img :src="imageUrl" alt="user's profile picture">
    <div>
      {{ user.value.email }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
img {
  margin-right: 0.5rem;
  border-radius: 100%;
}
</style>
