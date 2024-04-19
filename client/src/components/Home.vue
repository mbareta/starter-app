<script lang="ts">
import { mapActions, mapState } from 'pinia';
import { useUsersStore } from '../stores/users-store';

export default {
  props: {
    msg: { type: String }
  },
  computed: {
    ...mapState(useUsersStore, ['users'])
  },
  methods: {
    ...mapActions(useUsersStore, ['loadUsers'])
  },
  created() {
    this.loadUsers();
  }
};
</script>

<template>
  <router-link :to="{ name: 'home' }">Home</router-link>
  <router-link :to="{ name: 'another' }">Another</router-link>
  <h1>{{ msg }}</h1>
  {{ users }}
</template>

<style scoped>
</style>
