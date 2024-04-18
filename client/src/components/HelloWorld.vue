<script lang="ts">
export default {
  props: {
    msg: { type: String }
  },
  data() {
    return {
      users: []
    };
  },
  created() {
    fetch('http://localhost:3000/users')
      .then(res => res.json())
      .then(users => (this.users = users));
  }
};
</script>

<template>
  <h1>{{ msg }}</h1>
  {{ users }}
</template>

<style scoped>
</style>
