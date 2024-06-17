<script setup>
const toggleTheme = () => {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const value = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', value);
};

const logout = () => {
  localStorage.clear();
  window.location.replace('/');
}
</script>

<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <router-link :to="{ name: 'home' }" class="navbar-item">
      <img id="logo" src="/logo.svg">
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
    </div>
    <div class="navbar-end">
      <div class="navbar-item">
        <div class="buttons">
          <button @click="toggleTheme" class="button is-primary">
            Toggle theme
          </button>
          <button @click="logout" class="button">
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
