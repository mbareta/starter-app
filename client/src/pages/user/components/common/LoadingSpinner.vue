<script>
export default {
  props: {
    isLoading: { type: Boolean, default: false }
  }
};
</script>

<template>
  <div
    :class="{ 'is-sr-only': !isLoading }"
    aria-live="assertive"
    class="has-text-centered"
    role="alert">
    <div class="loader" />
    <p v-if="isLoading">Loading, please wait...</p>
    <p class="is-sr-only">Loading, please wait...</p>
  </div>
</template>

<style lang="scss" scoped>
.loader {
  height: 2.5rem;
  width: 2.5rem;
  margin: auto;
}

p {
  color: var(--bulma-scheme-invert);
}
</style>
