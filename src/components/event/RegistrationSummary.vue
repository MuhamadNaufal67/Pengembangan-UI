<script setup>
import AppCard from "@/components/ui/AppCard.vue";
defineProps({ event: { type: Object, required: true } });
defineEmits(["back"]);
</script>
<template>
  <aside class="summary-wrap">
    <button class="back" @click="$emit('back')">
      &larr; Back to Event Detail
    </button>
    <AppCard class="summary-card">
      <span>{{ event.cat }}</span>
      <h3>{{ event.title }}</h3>
      <p><b>Date &amp; Time</b><br />{{ event.date }}</p>
      <p><b>Location</b><br />{{ event.loc }}</p>
      <p>
        <b>Available Seats</b><br /><strong
          >{{ event.quota }} seats remaining</strong
        >
      </p>
      <p>{{ event.desc }}</p>
    </AppCard>
  </aside>
</template>
<style scoped>
.summary-wrap {
  position: sticky;
  top: var(--space-6);
}
.back {
  padding: 0;
  background: none;
  border: 0;
  color: var(--text-muted);
  cursor: pointer;
  margin-bottom: var(--space-4);
}
.summary-card {
  padding: var(--space-6);
}
.summary-card span,
strong {
  color: var(--primary);
}
.summary-card h3 {
  margin: var(--space-3) 0;
}
.summary-card p {
  color: var(--text-muted);
  line-height: 1.5;
}
.summary-card b {
  color: var(--text-main);
}
</style>
