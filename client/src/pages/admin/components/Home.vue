<script setup>
import clerk from 'admin/helpers/clerk';
</script>

<template>
  <h1 class="title">Welcome to starter admin pages.</h1>
  <p>{{ clerk.user }}</p>
</template>
