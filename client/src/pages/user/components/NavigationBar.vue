<script>
import UserAvatar from 'user/components/UserAvatar.vue';
import { useAuthStore } from 'user/stores/auth.store';

export default {
  components: { UserAvatar },
  methods: {
    logout() {
      const authStore = useAuthStore();
      authStore.logout();
      window.location.replace('/');
    },
    toggleTheme() {
      const current = document.documentElement.getAttribute('data-theme') ||
        'dark';
      const value = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', value);
    }
  }
}
</script>

<template>
  <nav
    class="navbar is-primary is-fixed-top"
    role="navigation"
    aria-label="main navigation">
    <div class="navbar-brand">
      <router-link :to="{ name: 'home' }" class="navbar-item">
        <img src="/logo.png" alt="application logo">
      </router-link>
    </div>

    <div id="navbar" class="navbar-menu">
      <div class="navbar-start">
        <router-link :to="{ name: 'home' }" class="navbar-item">
          Home
        </router-link>
        <router-link :to="{ name: 'courses' }" class="navbar-item">
          Courses
        </router-link>
      </div>
      <div class="navbar-end">
        <div class="navbar-item has-dropdown is-hoverable">
          <user-avatar :user="{}" />
          <div class="navbar-dropdown is-right">
            <div class="navbar-item">
              <button class="button is-primary" @click="toggleTheme">
                Toggle theme
              </button>
            </div>
            <div class="navbar-item">
              <button class="button" @click="logout">
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
.navbar-brand .navbar-item {
  padding: 0;
}
img {
  max-height: calc(var(--bulma-navbar-height) + 0.5rem) !important;
}

nav {
  border-bottom: 1px solid var(--bulma-primary);
  box-shadow: 1px 1px 3px var(--bulma-primary-00);
}

.navbar-dropdown {
  border-top: 1px solid var(--bulma-primary);
}

.has-dropdown {
  padding: 1rem !important;
  cursor: pointer;
}
</style>
