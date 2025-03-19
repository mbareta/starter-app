<script setup>
import LoadingSpinner from 'admin/components/LoadingSpinner.vue';
import PopOver from 'admin/components/PopOver.vue';
import { useCoursesStore } from 'admin/stores/courses.store';

const store = useCoursesStore();
defineEmits(['destroy', 'edit']);
</script>

<template>
  <table class="table is-striped">
    <thead>
      <th>ID</th>
      <th>UID</th>
      <th>Name</th>
      <th>Description</th>
      <th>Actions</th>
    </thead>
    <tbody>
      <loading-spinner :is-loading="store.isLoading" class="loading-spinner" />
      <tr v-for="course in store.courses" :key="course.uid">
        <td>{{ course.id }}</td>
        <td>{{ course.uid }}</td>
        <td>{{ course.name }}</td>
        <td>{{ course.description }}</td>
        <td class="actions">
          <button class="button is-info" @click="$emit('edit', user)">
            Edit
          </button>
          <pop-over class="popover is-right">
            <template #trigger>
              <div class="button is-danger">Delete</div>
            </template>
            <template #content="{ close }">
              <p>Are you sure you want to delete this user?</p>
              <div class="is-spaced-between">
                <button
                  class="button is-danger"
                  @click="$emit('destroy', course)">
                  Yes
                </button>
                <button class="button" @click="close">
                  No
                </button>
              </div>
            </template>
          </pop-over>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style lang="scss" scoped>
.popover {
  margin-left: 2rem;

  button {
    width: calc(50% - 2rem);
    margin: 1rem;
  }

  p {
    margin: 1rem;
  }

  &:deep(.dropdown-content) {
    width: 18rem;
  }
}
</style>
