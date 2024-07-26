<script>
import { mapActions, mapState } from 'pinia';
import { useUsersStore } from 'admin/stores/users-store';
import Modal from 'admin/components/common/Modal.vue';
import InputText from 'admin/components/common/input/Text.vue';

export default {
  props: {
    user: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      email: '',
      message: null
    };
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
  },
  watch: {
    user: {
      handler(val) {
        this.email = val?.email;
      },
      immediate: true
    }
  },
  components: { InputText, Modal }
};
</script>

<template>
  <modal @close="$emit('close')" isOpen>
    <h2 class="title has-text-centered">Create User</h2>
    <form @submit.prevent="saveUser">
      <input-text v-model="email" label="Email" type="email" />
      <input type="submit" value="Save" class="button is-primary">
      <p>{{ message }}</p>
    </form>
  </modal>
</template>

<style scoped>
  input, button, p {
    display: block;
    margin: 1rem auto;
    padding: 1rem;
    font-size: 1.25rem;
  }
</style>
