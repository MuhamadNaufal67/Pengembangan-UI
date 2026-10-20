<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "Action Confirmation",
  },
  message: {
    type: String,
    default: "Are you sure you want to proceed with this action?",
  },
  confirmText: {
    type: String,
    default: "Yes, Proceed",
  },
  cancelText: {
    type: String,
    default: "Cancel",
  },
});

defineEmits(["confirm", "close"]);
</script>

<template>
  <Transition name="modal-fade">
    <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-card">
        <div class="modal-header">
          <div class="modal-icon">⚠️</div>
          <h3 class="modal-title">{{ title }}</h3>
        </div>

        <div class="modal-body">
          <p class="modal-message">{{ message }}</p>
          <slot />
        </div>

        <div class="modal-footer">
          <button class="btn-cancel" @click="$emit('close')">
            {{ cancelText }}
          </button>
          <button class="btn-confirm" @click="$emit('confirm')">
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  padding: var(--space-4);
  background-color: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.modal-card {
  width: 100%;
  max-width: 460px;
  padding: var(--space-6);
  background: white;
  border: 1px solid var(--border-color);
  border-radius: var(--space-4);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes scaleUp {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }

  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
}

.modal-icon {
  font-size: 1.8rem;
  line-height: 1;
}

.modal-title {
  color: var(--text-main);
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
}

.modal-body {
  margin-bottom: var(--space-6);
}

.modal-message {
  color: var(--text-muted);
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
}

.btn-cancel {
  padding: var(--space-2) var(--space-4);
  color: var(--text-muted);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  background: var(--bg-light);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  transition: all 0.2s;
}

.btn-cancel:hover {
  color: var(--text-main);
  background: #e2e8f0;
}

.btn-confirm {
  padding: var(--space-2) var(--space-5);
  color: white;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  background: #e63946;
  border: none;
  border-radius: 8px;
  transition:
    background-color 0.2s,
    transform 0.1s;
}

.btn-confirm:hover {
  background: #d62828;
}

.btn-confirm:active {
  transform: scale(0.98);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
