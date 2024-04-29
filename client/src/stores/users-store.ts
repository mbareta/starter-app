import { defineStore } from 'pinia';
import request from '../helpers/request';

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: []
  }),
  actions: {
    loadUsers() {
      return request.get('/users')
        .then(({ data }) => (this.users = data));
    }
  }
});
