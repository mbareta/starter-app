<script setup>
import { useUsersStore } from '../../stores/users-store';
const store = useUsersStore();
</script>

<template>
  <table class="table is-striped">
    <thead>
      <th>ID</th>
      <th>Email</th>
      <th>Password</th>
      <th>Role</th>
      <th>Actions</th>
    </thead>
    <tbody>
      <tr v-for="user in store.users">
        <td>{{ user.id }}</td>
        <td>{{ user.email }}</td>
        <td>{{ user.password }}</td>
        <td>{{ user.role }}</td>
        <td class="is-spaced-between">
          <button @click="$emit('edit', user)" class="button is-info">
            Edit
          </button>
          <button @click="$emit('destroy', user)" class="button is-danger">
            Delete
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>
