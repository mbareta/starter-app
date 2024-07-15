<script>
export default {
  props: {
    disabled: { type: Boolean, default: false },
    label: { type: String, required: true },
    modelValue: { type: [Number, String], default: '' },
    name: { type: String, default: 'input-text' },
    placeholder: { type: String, default: '' },
    type: { type: String, default: 'text' }
  },
  computed: {
    value: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      }
    }
  }
}
</script>

<template>
  <div class="field">
    <label class="label">{{ label }}</label>
    <div class="control">
      <input
        v-model="value"
        :disabled="disabled"
        :name="name"
        :placeholder="placeholder || `Enter ${label}...`"
        :type="type"
        class="input"
        name="label">
    </div>
  </div>
</template>
