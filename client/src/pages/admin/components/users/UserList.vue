<script setup>
import PopOver from 'admin/components/common/PopOver.vue';
import { useUsersStore } from 'admin/stores/users.store';

const store = useUsersStore();
defineEmits(['destroy', 'edit']);
</script>

<template>
  <table class="table is-striped">
    <thead>
      <th>ID</th>
      <th>Email</th>
      <th>Sub</th>
      <th>Role</th>
      <th>Actions</th>
    </thead>
    <tbody>
      <tr v-for="user in store.users" :key="user.id">
        <td>{{ user.id }}</td>
        <td>{{ user.email }}</td>
        <td>{{ user.sub }}</td>
        <td>{{ user.role }}</td>
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
                  @click="$emit('destroy', user)">
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
