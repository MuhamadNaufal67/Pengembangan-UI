<script setup>
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useEvents } from "@/composables/useEvents";
import AppModal from "@/components/ui/AppModal.vue";
import RegistrationForm from "@/components/event/RegistrationForm.vue";
import RegistrationReceipt from "@/components/event/RegistrationReceipt.vue";
import RegistrationSummary from "@/components/event/RegistrationSummary.vue";
const route = useRoute();
const router = useRouter();
const { getEventById } = useEvents();
const event = computed(() => getEventById(route.params.id));
const confirmed = ref(null);
const showModal = ref(false);
const success = (record) => {
  confirmed.value = record;
  showModal.value = true;
};
</script>
<template>
  <div class="registration">
    <template v-if="event"
      ><RegistrationSummary
        :event="event"
        @back="router.push(`/browse/events/${event.id}`)" /><RegistrationForm
        :event="event"
        @success="success"
        @cancel="router.push(`/browse/events/${event.id}`)" /><AppModal
        :is-open="showModal"
        title="Registration Confirmed"
        confirm-text="View My Ticket"
        cancel-text="Back to Catalog"
        @confirm="router.push(`/browse/your-events/${confirmed.id}`)"
        @close="router.push('/browse/events')"
        ><RegistrationReceipt
          :confirmed-data="confirmed"
          :event="event" /></AppModal
    ></template>
    <p v-else>Event is no longer available.</p>
  </div>
</template>
<style scoped>
.registration {
  max-width: 1100px;
  margin: auto;
  display: grid;
  grid-template-columns: 1fr 1.6fr;
  gap: var(--space-8);
}
@media (max-width: 800px) {
  .registration {
    grid-template-columns: 1fr;
  }
  .summary-wrap {
    position: static;
  }
}
</style>
