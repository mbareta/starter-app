<script>
import { mapActions, mapState } from 'pinia';
import { useUsersStore } from '../../stores/users-store';
import UserForm from './Form.vue';

export default {
  props: {
    msg: { type: String }
  },
  data() {
    return {
      showModal: false
    };
  },
  computed: mapState(useUsersStore, ['users']),
  methods: mapActions(useUsersStore, ['loadUsers']),
  components: { UserForm },
  created() {
    this.loadUsers();
  }
};
</script>

<template>
  <div class="box">
    <h1 class="title">Users</h1>
    <p>This is a list of all users in the database.</p>
    <button @click="showModal = true" class="button is-primary add-user-button">
      Add User
    </button>
  </div>
  <table class="table is-fullwidth is-striped">
    <thead>
      <th>ID</th>
      <th>Email</th>
      <th>Password</th>
      <th>Role</th>
    </thead>
    <tbody>
      <tr v-for="user in users">
        <td>{{ user.id }}</td>
        <td>{{ user.email }}</td>
        <td>{{ user.password }}</td>
        <td>{{ user.role }}</td>
      </tr>
    </tbody>
  </table>
  <user-form
    v-if="showModal"
    @close="showModal = false"
    @saved="showModal = false; loadUsers()" />
</template>

<style lang="scss">
.box {
  position: relative;
  margin: 1rem;
}

.add-user-button {
  position: absolute !important;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
}
</style>
