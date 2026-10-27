<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useEvents } from "@/composables/useEvents";
import AppButton from "@/components/ui/AppButton.vue";
import AppCard from "@/components/ui/AppCard.vue";
import RegistrationReceipt from "@/components/event/RegistrationReceipt.vue";
const route = useRoute();
const router = useRouter();
const { userRegistrations, getEventById } = useEvents();
const ticket = computed(() =>
  userRegistrations.value.find((item) => item.id === Number(route.params.id)),
);
</script>
<template>
  <div class="receipt-page">
    <AppCard v-if="ticket" class="sheet"
      ><p class="eyebrow">GATHERLY DIGITAL TICKET</p>
      <h1>{{ ticket.eventTitle }}</h1>
      <RegistrationReceipt
        :confirmed-data="ticket"
        :event="getEventById(ticket.eventId)"
      />
      <p class="reason"><b>Reason for attending:</b> {{ ticket.reason }}</p>
      <AppButton @click="router.push('/browse/your-events')"
        >Back to Your Events</AppButton
      ></AppCard
    ><AppCard v-else class="sheet"
      ><h1>Ticket Not Found</h1>
      <p>This ticket is unavailable.</p>
      <AppButton @click="router.push('/browse/your-events')"
        >Back to Your Events</AppButton
      ></AppCard
    >
  </div>
</template>
<style scoped>
.receipt-page {
  max-width: 720px;
  margin: auto;
}
.sheet {
  padding: var(--space-8);
}
.eyebrow {
  color: var(--primary);
  font-weight: 700;
  letter-spacing: 1px;
}
.sheet h1 {
  margin-top: 0;
}
.reason {
  padding-top: var(--space-4);
  color: var(--text-muted);
  border-top: 1px solid var(--border-color);
}
</style>
