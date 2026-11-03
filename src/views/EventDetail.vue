<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useEvents } from "@/composables/useEvents";
import AppButton from "@/components/ui/AppButton.vue";
import AppCard from "@/components/ui/AppCard.vue";
const route = useRoute();
const router = useRouter();
const {
  getEventById,
  fetchEventById,
  loading,
  error,
  isUserRegistered,
  getRegistrationByEventId,
} = useEvents();
const remoteEvent = ref(null);
const event = computed(
  () => getEventById(route.params.id) || remoteEvent.value,
);
const registered = computed(() => isUserRegistered(route.params.id));
const registration = computed(() => getRegistrationByEventId(route.params.id));
onMounted(async () => {
  remoteEvent.value = await fetchEventById(route.params.id);
});
</script>
<template>
  <div class="detail">
    <button class="back" @click="router.push('/browse/events')">
      &larr; Back to Events
    </button>
    <template v-if="event">
      <header>
        <span>{{ event.cat }}</span>
        <h1>{{ event.title }}</h1>
        <p>
          🗓️ {{ event.date }} · {{ event.loc }} · 👥 {{ event.quota }} seats
        </p>
      </header>
      <main>
        <article>
          <h2>About This Event</h2>
          <p>{{ event.desc }}</p>
        </article>
        <AppCard class="ticket"
          ><h3>Attendee Registration</h3>
          <b>{{ event.price }}</b>
          <p v-if="event.done">
            Registration is closed as this event has ended.
          </p>
          <p v-else-if="registered">
            You are already registered for this event.
          </p>
          <p v-else-if="event.quota <= 0">This event is sold out.</p>
          <p v-else>Secure your ticket before the quota is filled.</p>
          <AppButton
            v-if="!event.done && !registered && event.quota > 0"
            @click="router.push(`/browse/events/${event.id}/register`)"
            >Register Now</AppButton
          ><AppButton v-else variant="secondary" disabled>{{
            event.done
              ? "Registration Closed"
              : registered
                ? "Already Registered"
                : "Sold Out"
          }}</AppButton
          ><button
            v-if="registered"
            class="receipt"
            @click="router.push(`/browse/your-events/${registration.id}`)"
          >
            View Ticket Receipt &rarr;
          </button></AppCard
        >
      </main>
    </template>
    <AppCard v-else-if="loading" class="notfound"
      ><h2>Loading event...</h2></AppCard
    >
    <AppCard v-else class="notfound"
      ><h2>404 - Event Not Found</h2>
      <p>{{ error || "This event is unavailable or removed." }}</p>
      <AppButton @click="router.push('/browse/events')"
        >Back to Catalog</AppButton
      ></AppCard
    >
  </div>
</template>
<style scoped>
.detail {
  max-width: 1100px;
  margin: auto;
}
.back,
.receipt {
  background: none;
  border: 0;
  color: var(--primary);
  cursor: pointer;
  padding: 0;
}
.back {
  color: var(--text-muted);
  margin-bottom: var(--space-6);
}
header {
  padding: var(--space-8);
  background: var(--bg-light);
  border: 1px solid var(--border-color);
  border-radius: var(--space-4);
  margin-bottom: var(--space-8);
}
header span {
  color: var(--primary);
  font-weight: 700;
}
header h1 {
  font-size: 2.6rem;
  margin: var(--space-3) 0;
}
header p,
article p {
  color: var(--text-muted);
  line-height: 1.7;
}
main {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--space-8);
}
article h2 {
  border-left: 4px solid var(--primary);
  padding-left: var(--space-2);
}
.ticket {
  padding: var(--space-6);
  height: max-content;
  text-align: center;
}
.ticket b {
  display: block;
  font-size: 2rem;
  color: var(--primary);
  margin: var(--space-3);
}
.ticket p {
  color: var(--text-muted);
}
.receipt {
  display: block;
  margin: var(--space-4) auto 0;
}
.notfound {
  padding: var(--space-8);
  text-align: center;
}
@media (max-width: 800px) {
  main {
    grid-template-columns: 1fr;
  }
}
</style>
