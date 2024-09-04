<script>
export default {
  props: {
    element: { type: Object, required: true }
  }
};
</script>

<template>
  <div v-html="element.data.content"></div>
</template>

<style lang="scss" scoped>
::v-deep strong {
  color: var(--bulma-scheme-invert) !important;
}
</style>
