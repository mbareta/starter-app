<script>
import request from 'public/helpers/request';

export default {
  props: {
    course: { type: Object, default: () => ({}) },
    page: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      data: {},
      selectedContainerIndex: 0
    };
  },
  methods: {
    loadData({ courseId, containerId }) {
      return request.get(`/courses/${courseId}/module/${containerId}`)
        .then(({ data }) => (this.data = data));
    }
  },
  watch: {
    selectedContainerIndex: {
      immediate: true,
      handler(index) {
        const { id: containerId } = this.page.contentContainers[index];
        return this.loadData({ courseId: this.course.id, containerId });
      }
    }
  }
};
</script>

<template>
  <div>
    <h3 class="title has-text-white has-text-centered">{{ page.meta?.name }}</h3>
    <div v-if="page.contentContainers.length > 1" class="container-nav">
      <button
        @click="selectedContainerIndex--"
        class="button is-white is-outlined">
        Previous
      </button>
      <div class="pill-container">
        <button
          v-for="(container, index) in page.contentContainers"
          :key="container.uid"
          @click="selectedContainerIndex = index"
          :class="{ 'is-active': index === selectedContainerIndex }"
          class="pill">
        </button>
      </div>
      <button
        @click="selectedContainerIndex++"
        class="button is-white is-outlined">
        Next
      </button>
    </div>
    <div class="content">
      <div v-for="element in data.elements" :key="element.uid">
        {{ element.type }}
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
  border-top: 2px solid var(--bulma-white);
  background: var(--bulma-white);
  border-radius: var(--bulma-radius-small);
}
</style>
