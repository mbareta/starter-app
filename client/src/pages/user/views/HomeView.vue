<script setup>
import { computed } from 'vue';
import { useAuthStore } from 'user/stores/auth.store';

const store = useAuthStore();
const email = computed(() => store.profile.email);
</script>

<template>
  <div>
    <section class="hero is-success is-large">
      <div class="hero-body">
        <h1 class="title">Welcome {{ email }}!</h1>
        <h2 class="subtitle">There's no place like 127.0.0.1!</h2>
      </div>
    </section>
  </div>
</template>
