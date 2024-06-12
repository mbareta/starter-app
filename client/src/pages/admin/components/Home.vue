<script>
import { mapActions, mapState } from 'pinia';
import { useUsersStore } from '../stores/users-store';

export default {
  props: {
    msg: { type: String }
  },
  computed: {
    ...mapState(useUsersStore, ['users', 'profile'])
  },
  methods: {
    ...mapActions(useUsersStore, ['loadUsers', 'loadProfile'])
  },
  created() {
    this.loadUsers();
    this.loadProfile();
  }
};
</script>

<template>
  <router-link :to="{ name: 'home' }">Home</router-link>
  <router-link :to="{ name: 'users' }">Users</router-link>
  <h1>{{ msg }}</h1>
  {{ users }}
  Prof: {{ profile }}
</template>

<style scoped>
</style>
