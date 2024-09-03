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
    <h3 class="title has-text-centered">{{ page.meta?.name }}</h3>
    <div class="container-nav">
      <button
        @click="selectedContainerIndex--"
        class="button is-white is-outlined is-small">
        Previous
      </button>
      <button
        v-for="(container, index) in page.contentContainers"
        :key="container.uid"
        @click="selectedContainerIndex = index"
        :class="{ 'is-active': index === selectedContainerIndex }"
        class="pill">
      </button>
      <button
        @click="selectedContainerIndex++"
        class="button is-white is-outlined is-small">
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
  border-bottom: 2px solid var(--bulma-white);
  display: flex;
  justify-content: center;
  align-items: center;

  .pill {
    width: 1rem;
    height: 1rem;
    margin: 0 2rem;
    background: var(--bulma-white);
    border-radius: 1rem;
    text-align: center;
    transform: translateX(-0.5rem);

    &.is-active {
      width: 2rem;
    }
  }
}
</style>
