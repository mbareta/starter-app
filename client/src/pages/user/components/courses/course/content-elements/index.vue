<script>
import CeHtml from './CeHtml.vue';
import CeImage from './CeImage.vue';

const types = {
  CE_HTML_DEFAULT: 'ce-html',
  CE_IMAGE: 'ce-image'
}

export default {
  props: {
    element: { type: Object, required: true }
  },
  computed: {
    componentName() {
      return types[this.element.type];
    }
  },
  components: { CeHtml, CeImage }
};
</script>

<template>
  <component
    :is="componentName"
    :element="element" />
</template>
