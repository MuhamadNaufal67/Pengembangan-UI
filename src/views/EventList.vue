<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useEvents } from "@/composables/useEvents";
import AppButton from "@/components/ui/AppButton.vue";
import CategoryFilter from "@/components/event/CategoryFilter.vue";
import EventCard from "@/components/event/EventCard.vue";
import SearchBar from "@/components/event/SearchBar.vue";

const router = useRouter();
const { activeEvents, loading, error, fetchEvents, isUserRegistered } =
  useEvents();
const searchQuery = ref("");
const selectedCategory = ref("All");
const categories = [
  "All",
  "Workshop",
  "Meetup",
  "Competition",
  "Seminar",
  "Conference",
];
const filteredEvents = computed(() =>
  activeEvents.value.filter(
    (event) =>
      (event.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        event.loc.toLowerCase().includes(searchQuery.value.toLowerCase())) &&
      (selectedCategory.value === "All" ||
        event.cat === selectedCategory.value),
  ),
);
onMounted(fetchEvents);
</script>
<template>
  <div class="event-list-page">
    <div class="header">
      <div>
        <h1>Upcoming Events</h1>
        <p>
          Discover workshops, seminars, tech meetups, and competitions near you.
        </p>
      </div>
      <AppButton variant="outline" :loading="loading" @click="fetchEvents"
        >Reload</AppButton
      >
    </div>
    <div v-if="loading" class="grid">
      <div v-for="i in 6" :key="i" class="skeleton-card"></div>
    </div>
    <div v-else-if="error" class="network-error-card">
      <h2>Network Error</h2>
      <p>{{ error }}</p>
      <AppButton :loading="loading" @click="fetchEvents">Try Again</AppButton>
    </div>
    <template v-else
      ><div class="filters">
        <SearchBar v-model="searchQuery" /><CategoryFilter
          v-model="selectedCategory"
          :categories="categories"
        />
      </div>
      <div v-if="filteredEvents.length" class="grid">
        <EventCard
          v-for="event in filteredEvents"
          :key="event.id"
          :event="event"
          :is-registered="isUserRegistered(event.id)"
          @view-detail="router.push(`/browse/events/${event.id}`)"
        />
      </div>
      <div v-else class="empty">
        <h2>No Events Available Yet</h2>
        <p>There are currently no active events matching your search.</p>
        <AppButton @click="router.push('/dashboard/events')"
          >Go to Organizer Dashboard</AppButton
        >
      </div></template
    >
  </div>
</template>
<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-8);
}
h1 {
  margin: 0;
}
.header p {
  color: var(--text-muted);
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-6);
}
.filters {
  margin-bottom: var(--space-6);
}
.empty {
  max-width: 600px;
  padding: var(--space-8);
  margin: var(--space-8) auto;
  text-align: center;
  border: 1px dashed var(--border-color);
  border-radius: var(--space-4);
}
@media (max-width: 600px) {
  .header {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
