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
      return this.isPage ? 'is-info' : 'is-primary';
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
  <div :class="className" class="panel">
    <p
      :class="{ 'is-rounded': !isExpanded }"
      class="panel-heading is-spaced-between">
      {{ module.meta?.name }} ({{ module.type }})
      <button
        v-if="!isEmpty && !isPage"
        @click="isExpanded = !isExpanded"
        :class="className"
        class="button is-inverted">
        {{ isExpanded ? 'Collapse' : 'Expand' }}
      </button>
      <button
        v-if="isPage"
        @click="showPage = true"
        :class="className"
        class="button is-info is-inverted">
        View page
      </button>
    </p>
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
.panel {
  margin-left: 2rem;
}

.panel-heading {
  align-items: center;
  padding: 0.75rem;

  button {
    width: 6rem;
  }
}

.is-rounded {
  border-radius: var(--bulma-panel-radius);
}
</style>
