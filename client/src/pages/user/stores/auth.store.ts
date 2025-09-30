import { defineStore } from 'pinia';
import request from 'user/helpers/request';

const storeValue = (key: string, value: object) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const loadValue = (key: string) => {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : {};
};

const storeTokens = (tokens: object) => storeValue('tokens', tokens);

const storeProfile = (profile: object) => storeValue('profile', profile);

const loadTokens = () => loadValue('tokens');

const loadProfile = () => loadValue('profile');

export const useAuthStore = defineStore('auth', {
  state: () => ({ tokens: loadTokens(), profile: loadProfile() }),
  getters: {
    isLoggedIn(state) {
      return state.tokens.access_token && state.tokens.refresh_token;
    }
  },
  actions: {
    loadProfile() {
      return request.get('/auth/profile')
        .then(({ data }) => {
          this.profile = data;
          storeProfile(data);
        });
    },
    login(code: string) {
      return request.get(`/auth/login?code=${code}`)
        .then(async ({ data }) => {
          this.tokens = data;
          storeTokens(data);
          await this.loadProfile();
        });
    },
    logout() {
      this.tokens = {};
      storeTokens({});
    }
  }
});
