<script>
import Modal from 'public/components/common/Modal.vue';
import Page from './Page.vue';

const types = {
  module: 'COURSE_SCHEMA/MODULE',
  page: 'COURSE_SCHEMA/PAGE'
};

export default {
  name: 'course-module',
  props: {
    course: { type: Object, default: () => ({}) },
    module: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      isExpanded: false,
      showPage: false
    }
  },
  computed: {
    children() {
      const { structure = [] } = this.course || {};
      return structure
        .filter(it => it.parentId === this.module.id)
        .sort((a, b) => (a.position - b.position));
    },
    className() {
      return this.isPage ? 'is-page' : 'is-module';
    },
    isEmpty() {
      return this.children.length === 0;
    },
    isPage(){
      return this.module.type === types.page;
    }
  },
  components: { Modal, Page }
};
</script>

<template>
  <div :class="className" class="module-container">
    <div class="module-heading is-spaced-between">
      {{ module.meta?.name }} ({{ module.type }})
      <button
        v-if="!isEmpty && !isPage"
        @click="isExpanded = !isExpanded"
        class="button is-primary is-inverted">
        {{ isExpanded ? 'Collapse' : 'Expand' }}
      </button>
      <button
        v-if="isPage"
        @click="showPage = true"
        class="button is-info is-inverted">
        View page
      </button>
    </div>
    <div v-if="isExpanded">
      <course-module
        v-for="item in children"
        :key="item.id"
        :course="course"
        :module="item" />
    </div>
    <modal @close="showPage = null" :isOpen="showPage">
      <page v-if="showPage" :course="course" :page="module" />
    </modal>
  </div>
</template>

<style lang="scss" scoped>
.module-container {
  margin-left: 1.5rem;
  border-left: 3px solid var(--bulma-text);

  .module-heading {
    display: flex;
    align-items: center;
    margin: 0.5rem;
    padding: 0.5rem 0.75rem;
    font-weight: var(--bulma-weight-semibold);
  }

  &.is-module .module-heading {
    color: var(--bulma-primary-invert);
    background: var(--bulma-primary);
  }

  &.is-page .module-heading {
    color: var(--bulma-info-invert);
    background: var(--bulma-info);
  }
}
</style>
