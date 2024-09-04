<script>
export default {
  props: {
    element: { type: Object, required: true }
  },
  computed: {
    src() {
      return this.element.data.url ||
        'https://bulma.io/assets/images/placeholders/1280x960.png';
    }
  }
};
</script>

<template>
  <img :src="src" :alt="element.data.alt">
</template>
