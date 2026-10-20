<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useEvents } from "@/composables/useEvents";
import AppButton from "@/components/ui/AppButton.vue";
import AppCard from "@/components/ui/AppCard.vue";

const route = useRoute();
const router = useRouter();
const { getEventById } = useEvents();

const event = computed(() => getEventById(route.params.id));
</script>

<template>
  <div class="event-detail-page">
    <button class="btn-back" @click="router.push('/browse/events')">
      &larr; Back to Events
    </button>

    <div v-if="event">
      <div class="detail-header">
        <div class="header-tags">
          <span class="event-tag">{{ event.cat }}</span>
          <span v-if="event.done" class="status-tag status-ended"
            >Event Finished</span
          >
          <span v-else class="status-tag status-live">Open Registration</span>
        </div>

        <h1>{{ event.title }}</h1>

        <div class="meta-info">
          <span class="meta-item">🗓️ {{ event.date }}</span>
          <span class="meta-item">{{ event.loc }}</span>
          <span class="meta-item">👥 Quota: {{ event.quota }} Attendees</span>
        </div>
      </div>

      <div class="detail-content grid-asymmetric">
        <div class="main-desc">
          <h2>About This Event</h2>
          <p class="description-text">{{ event.desc }}</p>
        </div>

        <div class="sidebar">
          <AppCard class="ticket-card sticky-pane">
            <h3>Attendee Registration</h3>
            <p class="price">{{ event.price }}</p>
            <p class="ticket-desc">
              {{
                event.done
                  ? "Registration is closed as this event has ended."
                  : "Secure your ticket now before quota is filled."
              }}
            </p>

            <AppButton
              v-if="!event.done"
              variant="primary"
              class="btn-register"
              @click="
                alert(
                  'Ticket registered successfully! Your digital QR ticket has been sent to your email.',
                )
              "
            >
              Register Now
            </AppButton>
            <AppButton
              v-else
              variant="secondary"
              class="btn-register btn-disabled"
              disabled
            >
              Registration Closed
            </AppButton>
            <p v-if="!event.done" class="spots">
              Only {{ event.quota }} seats available!
            </p>
          </AppCard>
        </div>
      </div>
    </div>

    <div v-else class="not-found-card">
      <h2>404 - Event Not Found</h2>
      <p>
        The event you are looking for is unavailable or has been removed by the
        organizer.
      </p>
      <AppButton variant="primary" @click="router.push('/browse/events')">
        Back to Event Catalog
      </AppButton>
    </div>
  </div>
</template>

<style scoped>
.btn-back {
  padding: 0;
  color: var(--text-muted);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  background: none;
  border: none;
  margin-bottom: var(--space-6);
}

.btn-back:hover {
  color: var(--primary);
}

.detail-header {
  padding: var(--space-12) var(--space-8);
  margin-bottom: var(--space-8);
  background: var(--bg-light);
  border: 1px solid var(--border-color);
  border-radius: var(--space-4);
}

.header-tags {
  display: flex;
  gap: var(--space-3);
  align-items: center;
  margin-bottom: var(--space-4);
}

.event-tag {
  padding: var(--space-1) var(--space-4);
  color: var(--primary);
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  background: rgba(102, 68, 255, 0.1);
  border-radius: 50px;
}

.status-tag {
  padding: var(--space-1) var(--space-3);
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: 50px;
}

.status-live {
  color: #27ae60;
  background: rgba(46, 204, 113, 0.15);
}

.status-ended {
  color: #6c757d;
  background: rgba(108, 117, 125, 0.15);
}

.detail-header h1 {
  color: var(--text-main);
  font-size: 2.8rem;
  line-height: 1.2;
  margin-bottom: var(--space-4);
}

.meta-info {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-6);
}

.meta-item {
  color: var(--text-muted);
  font-size: 1.05rem;
  font-weight: 500;
}

.grid-asymmetric {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--space-12);
}

.main-desc h2 {
  padding-left: var(--space-2);
  font-size: 1.8rem;
  margin-bottom: var(--space-4);
  border-left: 4px solid var(--primary);
}

.description-text {
  color: var(--text-muted);
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: var(--space-6);
}

.ticket-card {
  padding: var(--space-8);
  text-align: center;
}

.sticky-pane {
  position: sticky;
  top: 100px;
}

.ticket-card h3 {
  font-size: 1.5rem;
  margin-bottom: var(--space-2);
}

.price {
  color: var(--primary);
  font-size: 2.8rem;
  font-weight: 800;
  margin-bottom: var(--space-2);
}

.ticket-desc {
  color: var(--text-muted);
  line-height: 1.5;
  margin-bottom: var(--space-6);
}

.btn-register {
  width: 100%;
}

.btn-disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.spots {
  color: #27ae60;
  font-size: 0.95rem;
  font-weight: 600;
  margin-top: var(--space-4);
}

.not-found-card {
  padding: var(--space-12);
  text-align: center;
  background: white;
  border: 1px solid var(--border-color);
  border-radius: var(--space-4);
}

.not-found-card h2 {
  margin-bottom: var(--space-2);
}

.not-found-card p {
  color: var(--text-muted);
  margin-bottom: var(--space-6);
}

@media (max-width: 900px) {
  .grid-asymmetric {
    grid-template-columns: 1fr;
  }
}
</style>
