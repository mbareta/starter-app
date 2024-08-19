<script>
const types = {
  module: 'COURSE_SCHEMA/MODULE',
  page: 'COURSE_SCHEMA/PAGE'
}
export default {
  props: {
    module: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      isExpanded: false
    }
  },
  computed: {
    className() {
      return this.module.type === types.module ? 'is-primary' : 'is-info'
    },
    isEmpty() {
      return this.module.contentContainers.length === 0;
    }
  }
};
</script>

<template>
  <div :class="className" class="panel">
    <p
      :class="{ 'is-rounded': !isExpanded }"
      class="panel-heading is-spaced-between">
      {{ module.meta.name }} ({{ module.contentContainers.length }})
      <button
        v-if="!isEmpty"
        @click="isExpanded = !isExpanded"
        :class="className"
        class="button is-outlined is-inverted">
        {{ isExpanded ? 'Collapse' : 'Expand' }}
      </button>
    </p>
    <div v-if="isExpanded && !isEmpty">
      <div
        v-for="item in module.contentContainers"
        :key="item.id"
        class="panel-block">
        {{ item }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.panel-heading {
  align-items: center;

  button {
    width: 6rem;
  }
}

.is-rounded {
  border-radius: var(--bulma-panel-radius);
}
</style>
