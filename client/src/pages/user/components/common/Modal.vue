<script setup>
defineProps({ isOpen: { type: Boolean, default: false } })
</script>

<template>
  <div :class="{ 'is-active': isOpen }" class="modal">
    <div class="modal-background"></div>
    <div class="modal-content">
      <slot></slot>
    </div>
    <button
      @click="$emit('close')"
      class="modal-close is-large"
      aria-label="close">
    </button>
  </div>
</template>
