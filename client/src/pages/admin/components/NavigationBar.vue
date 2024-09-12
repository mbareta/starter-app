<script>
export default {
  methods: {
    logout() {
      this.$auth0.logout({
        logoutParams: { returnTo: window.location.origin }
      });
      localStorage.clear();
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
    class="navbar is-fixed-top is-transparent"
    role="navigation"
    aria-label="main navigation">
    <div class="navbar-brand">
      <router-link :to="{ name: 'home' }" class="navbar-item">
        <img src="/logo-admin.svg" alt="application logo">
      </router-link>
    </div>

    <div id="navbar" class="navbar-menu">
      <div class="navbar-start">
        <router-link :to="{ name: 'home' }" class="navbar-item">
          Home
        </router-link>
        <router-link :to="{ name: 'users' }" class="navbar-item">
          Users
        </router-link>
        <router-link :to="{ name: 'courses' }" class="navbar-item">
          Courses
        </router-link>
      </div>
      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <button class="button is-primary" @click="toggleTheme">
              Toggle theme
            </button>
            <button class="button" @click="logout">
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
html[data-theme="light"] {
  img {
    filter: invert(1);
  }
}
</style>
