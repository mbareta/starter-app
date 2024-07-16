<script>
import { mapActions, mapState } from 'pinia';
import request from '../helpers/request';

export default {
  data() {
    return {
      message: null
    };
  },
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
  {{ $auth0.user }}
  <p>
    {{ message }}
  </p>
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
