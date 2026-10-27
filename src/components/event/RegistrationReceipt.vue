<script setup>
defineProps({
  confirmedData: { type: Object, default: null },
  event: { type: Object, default: null },
});
</script>
<template>
  <div v-if="confirmedData" class="receipt">
    <p>
      Thank you, <b>{{ confirmedData.fullName }}</b
      >. Your registration for <b>{{ confirmedData.eventTitle }}</b> is
      confirmed.
    </p>
    <div class="receipt-box">
      <p>
        <span>Booking Reference</span
        ><strong>{{ confirmedData.bookingCode }}</strong>
      </p>
      <p>
        <span>Attendee Email</span><b>{{ confirmedData.email }}</b>
      </p>
      <p>
        <span>Event Schedule</span><b>{{ confirmedData.eventDate }}</b>
      </p>
      <p>
        <span>Venue / Location</span><b>{{ confirmedData.eventLoc }}</b>
      </p>
    </div>
  </div>
</template>
<style scoped>
.receipt {
  color: var(--text-muted);
  line-height: 1.6;
}
.receipt-box {
  padding: var(--space-4);
  background: var(--bg-light);
  border: 1px solid var(--border-color);
  border-radius: 8px;
}
.receipt-box p {
  display: flex;
  justify-content: space-between;
  gap: var(--space-3);
  margin: var(--space-2) 0;
}
.receipt-box span {
  color: var(--text-muted);
}
.receipt-box b,
.receipt-box strong {
  color: var(--text-main);
}
.receipt-box strong {
  color: var(--primary);
  font-family: monospace;
}
</style>
