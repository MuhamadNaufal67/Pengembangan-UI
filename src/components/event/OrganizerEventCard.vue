<script setup>
import AppCard from "@/components/ui/AppCard.vue";
defineProps({
  event: { type: Object, required: true },
  isCompleted: { type: Boolean, default: false },
});
defineEmits(["view-detail", "complete", "delete"]);
</script>
<template>
  <AppCard class="card"
    ><span>{{ event.cat }}</span>
    <h3>{{ event.title }}</h3>
    <p>{{ event.date }} · {{ event.loc }}</p>
    <p>{{ event.desc }}</p>
    <button @click="$emit('view-detail', event.id)">View Details</button
    ><button v-if="!isCompleted" @click="$emit('complete', event)">
      Complete</button
    ><button @click="$emit('delete', event)">Delete</button></AppCard
  >
</template>
<style scoped>
.card {
  padding: var(--space-6);
}
.card p {
  color: var(--text-muted);
}
button {
  margin-right: var(--space-2);
}
</style>
