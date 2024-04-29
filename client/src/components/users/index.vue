<script>
import { mapActions, mapState } from 'pinia';
import request from '../../helpers/request';

export default {
  data() {
    return {
      email: '',
      password: '',
      message: null
    };
  },
  methods: {
    save() {
      this.message = null;
      const body = { email: this.email, password: this.password };
      return request.post('/users', body)
        .then(res => (this.message = res.data))
        .catch(err => (this.message = err.response.data));
    }
  }
};
</script>

<template>
  <h1>Create User</h1>
  <input v-model="email" type="text">
  <input v-model="password" type="password">
  <button @click="save">Save</button>
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
