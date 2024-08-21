<script setup>
import { useCoursesStore } from 'admin/stores/courses.store';
import Popover from 'admin/components/common/Popover.vue';

const store = useCoursesStore();
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
      <tr v-for="course in store.courses">
        <td>{{ course.id }}</td>
        <td>{{ course.uid }}</td>
        <td>{{ course.name }}</td>
        <td>{{ course.description }}</td>
        <td class="actions">
          <button @click="$emit('edit', user)" class="button is-info">
            Edit
          </button>
          <popover class="popover is-right">
            <template v-slot:trigger>
              <div class="button is-danger">Delete</div>
            </template>
            <template v-slot:content="{ close }">
              <p>Are you sure you want to delete this user?</p>
              <div class="is-spaced-between">
                <button
                  @click="$emit('destroy', course)"
                  class="button is-danger">
                  Yes
                </button>
                <button @click="close" class="button">
                  No
                </button>
              </div>
            </template>
          </popover>
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
