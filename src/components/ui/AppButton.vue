<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="['app-button', `btn-${variant}`]"
    @click="$emit('click')"
  >
    <span v-if="loading" class="btn-spinner"></span><slot />
  </button>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: "primary",
  },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  type: { type: String, default: "button" },
});

defineEmits(["click"]);
</script>

<style scoped>
.app-button {
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  padding: var(--space-3) var(--space-8);
  border-radius: 12px;
  border: none;
  cursor: pointer;
  display: inline-block;
  text-align: center;
  transition:
    transform 0.2s,
    background-color 0.2s;
}

.app-button:hover {
  transform: translateY(-2px);
}

.app-button:disabled {
  cursor: not-allowed;
  opacity: 0.65;
  transform: none;
}
.btn-spinner {
  display: inline-block;
  width: 1em;
  height: 1em;
  margin-right: var(--space-2);
  vertical-align: -2px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-top-color: currentColor;
  border-radius: 50%;
  animation: btn-spin 0.7s linear infinite;
}
@keyframes btn-spin {
  to {
    transform: rotate(360deg);
  }
}

.btn-primary {
  background-color: var(--primary);
  color: white;
  box-shadow: 0 8px 20px rgba(102, 68, 255, 0.3);
}

.btn-primary:hover {
  background-color: var(--primary-hover);
}

.btn-secondary {
  background-color: #f0f0f0;
  color: var(--text-main);
}

.btn-secondary:hover {
  background-color: #e0e0e0;
}

.btn-outline {
  background-color: transparent;
  color: var(--primary);
  border: 1px solid var(--primary);
}

.btn-outline:hover {
  background-color: rgba(102, 68, 255, 0.1);
}
</style>
