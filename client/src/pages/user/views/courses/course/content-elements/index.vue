<script>
import CeHtml from './CeHtml.vue';
import CeImage from './CeImage.vue';

const types = {
  CE_HTML_DEFAULT: 'ce-html',
  CE_IMAGE: 'ce-image'
}

export default {
  components: { CeHtml, CeImage },
  props: {
    element: { type: Object, required: true }
  },
  computed: {
    componentName() {
      return types[this.element.type];
    }
  }
};
</script>

<template>
  <component
    :is="componentName"
    :element="element" />
</template>
