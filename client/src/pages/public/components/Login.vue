<script>
export default {
  methods: {
    login() {
      return this.$auth0.loginWithRedirect();
    }
  }
};
</script>

<template>
  <h1>LOG IN</h1>
  <button @click="login">Login</button>
  <p>{{ $auth0.user }}</p>
</template>

<style scoped>
  h1, p {
    text-align: center;
  }

  input, button, p {
    display: block;
    margin: 1rem auto;
    padding: 1rem;
    font-size: 1.25rem;
  }
</style>
