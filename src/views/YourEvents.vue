<script setup>
import { useRouter } from "vue-router";
import { useEvents } from "@/composables/useEvents";
import AppButton from "@/components/ui/AppButton.vue";
import AppCard from "@/components/ui/AppCard.vue";
const router = useRouter();
const { userRegistrations, getEventById, cancelRegistration } = useEvents();
const cancel = (record) => {
  if (confirm(`Cancel registration for ${record.eventTitle}?`))
    cancelRegistration(record.eventId);
};
</script>
<template>
  <div class="wallet">
    <h1>Your Events</h1>
    <p class="subtitle">Your registered events and digital tickets.</p>
    <div v-if="userRegistrations.length" class="tickets">
      <AppCard
        v-for="ticket in userRegistrations"
        :key="ticket.id"
        class="ticket"
        ><span
          :class="getEventById(ticket.eventId)?.done ? 'concluded' : 'upcoming'"
          >{{
            getEventById(ticket.eventId)?.done ? "Concluded" : "Upcoming"
          }}</span
        >
        <h2>{{ ticket.eventTitle }}</h2>
        <p>🗓️ {{ ticket.eventDate }}</p>
        <p>{{ ticket.eventLoc }}</p>
        <p>
          Reference: <b>{{ ticket.bookingCode }}</b>
        </p>
        <AppButton @click="router.push(`/browse/your-events/${ticket.id}`)"
          >View Ticket</AppButton
        ><button
          v-if="!getEventById(ticket.eventId)?.done"
          class="cancel"
          @click="cancel(ticket)"
        >
          Cancel Registration</button
        ><small v-else>Archived event</small></AppCard
      >
    </div>
    <AppCard v-else class="empty"
      ><h2>No tickets yet</h2>
      <p>Explore upcoming events and secure your first ticket.</p>
      <AppButton @click="router.push('/browse/events')"
        >Browse Events</AppButton
      ></AppCard
    >
  </div>
</template>
<style scoped>
.wallet {
  max-width: 1100px;
  margin: auto;
}
.subtitle,
.ticket p {
  color: var(--text-muted);
}
.tickets {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-6);
  margin-top: var(--space-8);
}
.ticket {
  padding: var(--space-6);
}
.ticket span {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 700;
}
.upcoming {
  color: #278f59;
  background: #d3f9d8;
}
.concluded {
  color: #6c757d;
  background: #e9ecef;
}
.cancel {
  display: block;
  margin-top: var(--space-3);
  color: #d62828;
  background: none;
  border: 0;
  cursor: pointer;
}
.empty {
  padding: var(--space-8);
  text-align: center;
  margin-top: var(--space-8);
}
</style>
