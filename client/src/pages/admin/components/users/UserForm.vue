<script>
import { mapActions } from 'pinia';
import ModalWrapper from 'admin/components/common/ModalWrapper.vue';
import TextInput from 'admin/components/common/input/TextInput.vue';
import { useUsersStore } from 'admin/stores/users.store';

export default {
  components: { TextInput, ModalWrapper },
  props: {
    user: { type: Object, default: () => ({}) }
  },
  emits: ['close', 'saved', 'watch'],
  data() {
    return {
      email: '',
      message: null
    };
  },
  watch: {
    user: {
      handler(val) {
        this.email = val?.email;
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions(useUsersStore, ['save']),
    saveUser() {
      this.message = null;
      const data = { id: this.user?.id, email: this.email };
      return this.save(data)
        .then(() => this.$emit('saved'))
        .catch(err => (this.message = err.response.data));
    }
  }
};
</script>

<template>
  <modal-wrapper is-open @close="$emit('close')">
    <h2 class="title has-text-centered">Create User</h2>
    <form @submit.prevent="saveUser">
      <text-input v-model="email" label="Email" type="email" />
      <input type="submit" value="Save" class="button is-primary">
      <p>{{ message }}</p>
    </form>
  </modal-wrapper>
</template>

<style scoped>
  input, button, p {
    display: block;
    margin: 1rem auto;
    padding: 1rem;
    font-size: 1.25rem;
  }
</style>
