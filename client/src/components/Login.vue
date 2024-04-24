<script lang="ts">
import { mapActions, mapState } from 'pinia';
import axios from 'axios';
import { useUsersStore } from '../stores/users-store';

export default {
  data() {
    return {
      email: '',
      password: '',
      message: null
    };
  },
  methods: {
    login() {
      this.message = null;
      const body = { email: this.email, password: this.password };
      return axios.post('http://localhost:3000/auth/login', body)
        .then(res => (this.message = res.data))
        .catch(err => (this.message = err.response.data.message));
    }
  }
};
</script>

<template>
  <input v-model="email" type="text">
  <input v-model="password" type="password">
  <button @click="login">Login</button>
  <p>
    {{ message }}
  </p>
</template>

<style scoped>
  input, button, p {
    display: block;
    margin: 1rem auto;
    padding: 1rem;
    font-size: 1.25rem;
  }
</style>
