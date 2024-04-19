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
  <h1>{{ msg }}</h1>
  {{ users }}
</template>

<style scoped>
</style>
