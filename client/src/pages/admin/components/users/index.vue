<script>
import { mapActions, mapState } from 'pinia';
import { useUsersStore } from 'admin/stores/users-store';
import UserForm from './Form.vue';
import UserList from './List.vue';

export default {
  props: {
    msg: { type: String }
  },
  data() {
    return {
      showModal: false,
      editingUser: null
    };
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
  },
  components: { UserForm, UserList },
  created() {
    this.loadUsers();
  }
};
</script>

<template>
  <div class="box">
    <h1 class="title">Users</h1>
    <p>This is a list of all users in the database.</p>
    <button @click="showModal = true" class="button is-primary add-user-button">
      Add User
    </button>
  </div>
  <user-list @edit="edit" @destroy="destroyUser" />
  <user-form
    v-if="showModal"
    :user="editingUser"
    @close="closeModal"
    @saved="closeModal(); loadUsers()" />
</template>

<style lang="scss">
.box {
  position: relative;
  margin: 1rem;
}

.add-user-button {
  position: absolute !important;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
}

.table {
  width: calc(100% - 2rem);
  margin: 1rem;
}
</style>
