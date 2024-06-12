import { defineStore } from 'pinia';
import request from '../helpers/request';

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [],
    profile: {}
  }),
  actions: {
    loadUsers() {
      return request.get('/users')
        .then(({ data }) => (this.users = data));
    },
    loadProfile() {
      return request.get('/auth/profile')
        .then(({ data }) => (this.profile = data));
    }
  }
});
