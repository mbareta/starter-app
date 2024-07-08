<script>
export default {
  data() {
    return {
      isActive: false
    };
  },
  methods: {
    onClick(e) {
      if (this.$el === e.target || this.$el.contains(e.target)) return;
      this.close();
    },
    close() {
      this.isActive = false;
    },
    toggle() {
      this.isActive = !this.isActive;
    }
  },
  mounted() {
    document.addEventListener('click', this.onClick);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.onClick);
  }
};
</script>

<template>
  <div :class="{ 'is-active': isActive }" class="dropdown">
    <div class="dropdown-trigger">
      <button
        @click="toggle"
        :class="{ 'has-arrow': isActive }"
        class="button"
        aria-haspopup="true"
        aria-controls="dropdown-menu">
        <slot name="trigger">Expand</slot>
      </button>
    </div>
    <div class="dropdown-menu" id="dropdown-menu" role="menu">
      <div class="dropdown-content">
        <slot :close="close" name="content">No content yet...</slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dropdown-content {
  margin-top: 0.5rem;
}

.has-arrow {
  position: relative;

  &::before, &::after {
    content: " ";
    position: absolute;
    bottom: -13px;
    left: 50%;
    width: 0;
    height: 0;
    border: solid transparent;
    pointer-events: none;
    z-index: 100;
  }

  &::after {
    border-bottom-color: #161616;
    border-width: 8px;
    margin-left: -8px;
  }

  &::before {
    border-bottom-color: #222;
    border-width: 10px;
    margin-left: -10px;
  }
}

html[data-theme="light"] {
  .has-arrow {
    &::after {
      border-bottom-color: #fff;
    }

    &::before {
      border-bottom-color: #efefef;
    }
  }
}
</style>
