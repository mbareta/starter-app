<script>
import { mapActions, mapState } from 'pinia';
import request from '../helpers/request';

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
      return request.post('/auth/login', body)
        .then(({ data }) => {
          this.message = data;
          localStorage.setItem('JWT', data.token);
          if (data.user.role === 'ADMIN') return window.location.replace('/admin');
        })
        .catch(err => (this.message = err.response.data));
    }
  }
};
</script>

<template>
  <h1>LOG IN</h1>
  <input v-model="email" type="text">
  <input v-model="password" type="password">
  <button @click="login">Login</button>
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
