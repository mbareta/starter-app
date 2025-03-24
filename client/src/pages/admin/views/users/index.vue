<script>
import { mapActions, mapState } from 'pinia';
import UserForm from './UserForm.vue';
import UserList from './UserList.vue';
import { useUsersStore } from 'admin/stores/users.store';

export default {
  components: { UserForm, UserList },
  props: {
    msg: { type: String, default: '' }
  },
  data() {
    return {
      showModal: false,
      editingUser: null
    };
  },
  computed: mapState(useUsersStore, ['isLoading']),
  created() {
    this.loadUsers();
  },
  methods: {
    ...mapActions(useUsersStore, ['destroy', 'loadUsers']),
    closeModal() {
      Object.assign(this, { showModal: false, editingUser: null });
    },
    edit(user) {
      this.editingUser = user;
      this.showModal = true;
    },
    destroyUser(user) {
      return this.destroy(user).then(() => this.loadUsers());
    }
  }
};
</script>

<template>
  <section class="hero is-medium is-warning">
    <div class="hero-body">
      <h1 class="title">Users</h1>
      <h2 class="subtitle">This is a list of all users in the database.</h2>
    </div>
  </section>
  <button class="button is-primary add-user-button" @click="showModal = true">
    Add New User
  </button>
  <user-list @edit="edit" @destroy="destroyUser" />
  <user-form
    v-if="showModal"
    :user="editingUser"
    @close="closeModal"
    @saved="closeModal(); loadUsers()" />
</template>

<style lang="scss">
.add-user-button {
  margin: 1rem 1rem 0 1rem;
}

.table {
  width: calc(100% - 2rem);
  margin: 1rem;
}
</style>
