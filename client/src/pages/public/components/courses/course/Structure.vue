<script>
import Module from './Module.vue';

export default {
  props: {
    structure: { type: Array, default: () => [] }
  },
  methods: {
    getChildModules(parentId) {
      return this.structure
        .filter(it => it.parentId === parentId)
        .sort((a, b) => (a.position - b.position));
    }
  },
  components: { Module }
}
</script>

<template>
  <div>
    <div v-for="item in getChildModules(null)" :key="item.id" class="box">
      <Module :module="item" />
    </div>
  </div>
</template>
