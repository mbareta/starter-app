<script>
export default {
  props: {
    element: { type: Object, required: true }
  }
};
</script>

<template>
  <div v-html="element.data.content" />
</template>

<style lang="scss" scoped>
:deep(strong) {
  color: var(--bulma-scheme-invert) !important;
}
</style>
