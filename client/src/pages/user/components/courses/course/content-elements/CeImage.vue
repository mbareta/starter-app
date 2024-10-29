<script>
import request from 'user/helpers/request';

export default {
  props: {
    element: { type: Object, required: true }
  },
  data() {
    return {
      src: ''
    };
  },
  computed: {
    url() {
      const { url = '' } = this.element.data?.assets;
      return url.split('assets/')[1];
    }
  },
  mounted() {
    if (!this.url) {
      return 'https://bulma.io/assets/images/placeholders/1280x960.png';
    }
    this.src = '';
    return request.get(`/courses/asset-url?path=${this.url}`)
      .then(({ data }) => { this.src = data; });
  }
};
</script>

<template>
  <img :src="src" :alt="element.data.alt">
</template>
