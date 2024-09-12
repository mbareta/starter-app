<script>
import LoadingSpinner from 'user/components/common/LoadingSpinner.vue';
import ContentElement from './content-elements/index.vue';
import request from 'user/helpers/request';

export default {
  components: { ContentElement, LoadingSpinner },
  props: {
    course: { type: Object, default: () => ({}) },
    page: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      data: {},
      isLoading: true,
      selectedContainerIndex: 0
    };
  },
  watch: {
    selectedContainerIndex: {
      immediate: true,
      handler(index) {
        const { id: containerId } = this.page.contentContainers[index];
        return this.loadData({ courseId: this.course.id, containerId });
      }
    }
  },
  methods: {
    loadData({ courseId, containerId }) {
      this.isLoading = true;
      this.data = {};
      return request.get(`/courses/${courseId}/container/${containerId}`)
        .then(({ data }) => {
          this.data = data;
          this.isLoading = false;
        });
    }
  }
};
</script>

<template>
  <div>
    <h3 class="title has-text-white has-text-centered">{{ page.meta?.name }}</h3>
    <div v-if="page.contentContainers.length > 1" class="container-nav">
      <button
        class="button is-white is-outlined"
        @click="selectedContainerIndex--">
        Previous
      </button>
      <div class="pill-container">
        <button
          v-for="(container, index) in page.contentContainers"
          :key="container.uid"
          :class="{ 'is-active': index === selectedContainerIndex }"
          class="pill"
          @click="selectedContainerIndex = index" />
      </div>
      <button
        class="button is-white is-outlined"
        @click="selectedContainerIndex++">
        Next
      </button>
    </div>
    <div class="content">
      <loading-spinner :is-loading="isLoading" />
      <div v-for="element in data.elements" :key="element.uid">
        <content-element :element="element" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container-nav {
  padding: 1rem;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .pill-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .pill {
    width: 1rem;
    height: 1rem;
    margin: 0 2rem;
    background: var(--bulma-white);
    border-radius: 1rem;
    text-align: center;
    transition: padding 0.3s;

    &.is-active {
      padding: 0 1rem;
    }
  }

  .button {
    width: 6rem;
  }
}

.content {
  min-height: 20rem;
  padding: 2rem;
  color: var(--bulma-scheme-invert);
  border-top: 2px solid var(--bulma-white);
  background: var(--bulma-white);
  border-radius: var(--bulma-radius-small);
}
</style>
