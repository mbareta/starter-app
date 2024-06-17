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
        .then(() => this.$emit('saved'))
        .catch(err => (this.message = err.response.data));
    }
  }
};
</script>

<template>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-content">
      <h2 class="title has-text-centered">Create User</h2>
      <form @submit="save">
        <div class="field">
          <label class="label">Email</label>
          <div class="control">
            <input
              v-model="email"
              class="input is-danger"
              type="email"
              placeholder="Email">
          </div>
        </div>
        <div class="field">
          <label class="label">Password</label>
          <div class="control">
            <input
              v-model="password"
              class="input"
              type="password"
              placeholder="Password">
          </div>
        </div>
        <input type="submit" value="Save" class="button is-primary">
        <p>
          {{ message }}
        </p>
      </form>
    </div>
    <button
      @click="$emit('close')"
      class="modal-close is-large"
      aria-label="close">
    </button>
  </div>
</template>

<style scoped>
  input, button, p {
    display: block;
    margin: 1rem auto;
    padding: 1rem;
    font-size: 1.25rem;
  }
</style>
