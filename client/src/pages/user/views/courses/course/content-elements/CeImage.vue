<script setup>
import { computed } from 'vue';
import { useAsyncImage } from 'user/composables/async-asset-image';

const props = defineProps({
  element: { type: Object, required: true }
});

const url = computed(() => {
  return props.element.data?.assets?.url?.split('assets/')[1];
});

const { src } = useAsyncImage(url);
</script>

<template>
  <img :src="src" :alt="element.data.alt">
</template>
