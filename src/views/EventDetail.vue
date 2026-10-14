<script setup>
import AppButton from "@/components/ui/AppButton.vue";
import AppCard from "@/components/ui/AppCard.vue";
</script>

<template>
  <div class="event-detail-page">
    <button class="btn-back" @click="$router.push('/browse/events')">
      &larr; Back to Events
    </button>

    <div class="detail-header">
      <span class="event-tag">Workshop &amp; Training</span>
      <h1>Vue.js Mastery Workshop {{ $route.params.id }}</h1>

      <div class="meta-info">
        <span class="meta-item">🗓️ October 12, 2026</span>
        <span class="meta-item">📍 Tech Hub, Jakarta Pusat</span>
        <span class="meta-item">👥 Quota: 150 Attendees</span>
      </div>
    </div>

    <div class="detail-content grid-asymmetric">
      <div class="main-desc">
        <h2>About This Event</h2>
        <p>
          Are you ready to take your Vue.js skills to the next level? Join this
          intensive workshop where we will dive deep into the Vue 3 Composition
          API, state management with Pinia, and best practices for building
          scalable web applications.
        </p>
        <p>
          This event is designed for intermediate developers who already have a
          basic understanding of JavaScript and Vue.js. Bring your laptop, as
          this will be a hands-on coding session!
        </p>

        <h2>Agenda</h2>
        <ul class="agenda-list">
          <li><strong>09:00</strong> - Registration &amp; QR Check-in</li>
          <li><strong>10:00</strong> - Session 1: Composition API Deep Dive</li>
          <li><strong>11:30</strong> - Coffee Break &amp; Networking</li>
          <li>
            <strong>01:00</strong> - Session 2: State Management with Pinia
          </li>
          <li><strong>03:00</strong> - Q&amp;A and Closing Remarks</li>
        </ul>
      </div>

      <div class="sidebar">
        <AppCard class="ticket-card sticky-pane">
          <h3>Attendee Registration</h3>
          <p class="price">Free</p>
          <p class="ticket-desc">
            Secure your seat now before the quota is full.
          </p>
          <AppButton class="btn-register" variant="primary"
            >Register Now</AppButton
          >
          <p class="spots">Only 12 seats left!</p>
        </AppCard>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn-back {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: var(--space-6);
}

.detail-header {
  background: var(--bg-light);
  border: 1px solid var(--border-color);
  border-radius: var(--space-4);
  padding: var(--space-12) var(--space-8);
  margin-bottom: var(--space-8);
}

.event-tag {
  display: inline-block;
  background: rgba(102, 68, 255, 0.1);
  color: var(--primary);
  border-radius: 50px;
  padding: var(--space-1) var(--space-3);
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: var(--space-4);
}

.detail-header h1 {
  color: var(--text-main);
  font-size: 2.8rem;
  line-height: 1.2;
  margin-bottom: var(--space-4);
}

.meta-info {
  display: flex;
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
  border-left: 4px solid var(--primary);
  font-size: 1.8rem;
  margin-bottom: var(--space-4);
  padding-left: var(--space-2);
}

.main-desc p {
  color: var(--text-muted);
  font-size: 1.05rem;
  line-height: 1.8;
  margin-bottom: var(--space-6);
}

.agenda-list {
  list-style: none;
  padding: 0;
  margin: 0 0 var(--space-8);
}

.agenda-list li {
  border-bottom: 1px solid var(--border-color);
  color: var(--text-muted);
  font-size: 1.05rem;
  padding: var(--space-3) 0;
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
  margin-bottom: var(--space-6);
}

.btn-register {
  width: 100%;
}

.spots {
  color: #e63946;
  font-size: 0.95rem;
  font-weight: 600;
  margin-top: var(--space-4);
}

@media (max-width: 900px) {
  .grid-asymmetric {
    grid-template-columns: 1fr;
  }
}
</style>
