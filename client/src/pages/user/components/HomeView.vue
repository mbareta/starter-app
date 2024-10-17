<script setup>
import SoulMachine from './common/SoulMachine.vue';
</script>

<template>
  <div>
    <section class="hero is-success is-large">
      <div class="hero-body">
        <h1 class="title">Welcome {{ $auth0.user?.value?.name || 'user' }}!</h1>
        <h2 class="subtitle">There's no place like 127.0.0.1!</h2>
      </div>
    </section>
    <soul-machine />
  </div>
</template>
