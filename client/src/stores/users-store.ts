import { defineStore } from 'pinia';

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: []
  }),
  actions: {
    loadUsers() {
      fetch('http://localhost:3000/users')
        .then(res => res.json())
        .then(users => (this.users = users));
    }
  }
});
