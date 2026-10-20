<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useEvents } from "@/composables/useEvents";
import AppButton from "@/components/ui/AppButton.vue";
import CategoryFilter from "@/components/event/CategoryFilter.vue";
import EventCard from "@/components/event/EventCard.vue";
import SearchBar from "@/components/event/SearchBar.vue";

const router = useRouter();
const { activeEvents } = useEvents();

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

const filteredEvents = computed(() => {
  return activeEvents.value.filter((event) => {
    const matchSearch =
      event.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      event.loc.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchCategory =
      selectedCategory.value === "All" || event.cat === selectedCategory.value;

    return matchSearch && matchCategory;
  });
});

const handleViewDetail = (id) => {
  router.push(`/browse/events/${id}`);
};
</script>

<template>
  <div class="event-list-page">
    <div class="header-section">
      <h2 class="section-title">Upcoming Events</h2>
      <p class="section-desc">
        Discover workshops, seminars, tech meetups, and competitions near you.
      </p>
    </div>

    <div class="filters-section">
      <SearchBar v-model="searchQuery" />
      <CategoryFilter v-model="selectedCategory" :categories="categories" />
    </div>

    <div v-if="filteredEvents.length > 0" class="event-grid">
      <EventCard
        v-for="event in filteredEvents"
        :key="event.id"
        :event="event"
        @view-detail="handleViewDetail"
      />
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">📅</div>
      <h3>No Events Available Yet</h3>
      <p>
        There are currently no active events scheduled. Are you an organizer?
        Publish and manage your first event today through the Dashboard!
      </p>
      <div class="empty-action">
        <AppButton variant="primary" @click="router.push('/dashboard')">
          Go to Organizer Dashboard &rarr;
        </AppButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header-section {
  margin-bottom: var(--space-8);
}

.section-title {
  font-size: 2.2rem;
  margin-bottom: var(--space-2);
}

.section-desc {
  color: var(--text-muted);
  font-size: 1.1rem;
}

.filters-section {
  margin-bottom: var(--space-6);
}

.event-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-6);
}

.empty-state {
  max-width: 600px;
  padding: var(--space-12) var(--space-8);
  color: var(--text-muted);
  text-align: center;
  background: white;
  border: 1px dashed var(--border-color);
  border-radius: var(--space-4);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
  margin: var(--space-8) auto;
}

.empty-icon {
  font-size: 3.5rem;
  margin-bottom: var(--space-3);
}

.empty-state h3 {
  color: var(--text-main);
  font-size: 1.5rem;
  margin-bottom: var(--space-2);
}

.empty-state p {
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: var(--space-6);
}

.empty-action {
  display: flex;
  justify-content: center;
}
</style>
