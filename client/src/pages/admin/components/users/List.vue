<script setup>
import { useUsersStore } from 'admin/stores/users-store';
import Popover from 'admin/components/common/Popover.vue';
const store = useUsersStore();
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
      <tr v-for="user in store.users">
        <td>{{ user.id }}</td>
        <td>{{ user.email }}</td>
        <td>{{ user.sub }}</td>
        <td>{{ user.role }}</td>
        <td>
          <button @click="$emit('edit', user)" class="button is-info">
            Edit
          </button>
          <popover class="popover is-right">
            <template v-slot:trigger class="button is-danger">
              Delete
            </template>
            <template v-slot:content="{ close }">
              <p>Are you sure you want to delete this user?</p>
              <div class="is-spaced-between">
                <button @click="$emit('destroy', user)" class="button is-danger">
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
