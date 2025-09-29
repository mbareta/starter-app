import { defineStore } from 'pinia';
import request from 'admin/helpers/request';

const storeTokens = (tokens: object) => {
  localStorage.setItem('tokens', JSON.stringify(tokens));
};

const loadTokens = () => {
  const tokens = localStorage.getItem('tokens');
  return tokens ? JSON.parse(tokens) : {};
};

export const useAuthStore = defineStore('auth', {
  state: () => ({ tokens: loadTokens() }),
  getters: {
    isLoggedIn(state) {
      return state.tokens.access_token && state.tokens.refresh_token;
    }
  },
  actions: {
    login(code: string) {
      return request.get(`/auth/login?code=${code}`)
        .then(({ data }) => {
          this.tokens = data;
          storeTokens(data);
        });
    },
    logout() {
      this.tokens = {};
      storeTokens({});
    }
  }
});
