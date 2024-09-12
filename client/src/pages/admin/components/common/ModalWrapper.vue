<script setup>
defineProps({ isOpen: { type: Boolean, default: false } })
defineEmits(['close'])
</script>

<template>
  <div :class="{ 'is-active': isOpen }" class="modal">
    <div class="modal-background" />
    <div class="modal-content">
      <slot />
    </div>
    <button
      class="modal-close is-large"
      aria-label="close"
      @click="$emit('close')" />
  </div>
</template>
