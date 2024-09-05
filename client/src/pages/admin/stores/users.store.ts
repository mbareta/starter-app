import { defineStore } from 'pinia';
import request from 'admin/helpers/request';

const BASE_URL = '/users';

export const useUsersStore = defineStore('users', {
  state: () => ({ isLoading: false, users: [] }),
  actions: {
    loadUsers() {
      this.isLoading = true;
      return request.get(BASE_URL).then(({ data }) => {
        this.users = data;
        this.isLoading = false;
      });
    },
    destroy(user) {
      return request.delete(`${BASE_URL}/${user.id}`);
    },
    save(user) {
      if (user.id) return request.patch(`${BASE_URL}/${user.id}`, user);
      return request.post(BASE_URL, user);
    }
  }
});
