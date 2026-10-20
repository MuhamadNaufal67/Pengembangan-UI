<script setup>
import { useRouter } from "vue-router";
import { useEvents } from "@/composables/useEvents";
import AppButton from "@/components/ui/AppButton.vue";
import AppCard from "@/components/ui/AppCard.vue";

const router = useRouter();
const { events, totalEvents, activeEvents, completedEvents } = useEvents();
</script>

<template>
  <div class="dashboard-overview">
    <div class="dashboard-header">
      <div>
        <h2>Organizer Analytics &amp; Overview</h2>
        <p class="subtitle">
          Monitor real-time event statistics and track status across all managed
          events.
        </p>
      </div>
      <AppButton variant="primary" @click="router.push('/dashboard/events')">
        🎛️ Manage Events &rarr;
      </AppButton>
    </div>

    <div class="metrics-grid">
      <AppCard class="metric-card">
        <h3>Total Events</h3>
        <p class="metric-value">{{ totalEvents }}</p>
        <span class="metric-hint">All recorded events</span>
      </AppCard>

      <AppCard class="metric-card">
        <h3>Active Events</h3>
        <p class="metric-value text-success">{{ activeEvents.length }}</p>
        <span class="metric-hint">Live in public catalog</span>
      </AppCard>

      <AppCard class="metric-card">
        <h3>Completed Events</h3>
        <p class="metric-value text-muted">{{ completedEvents.length }}</p>
        <span class="metric-hint">Archived completed events</span>
      </AppCard>
    </div>

    <div class="data-table-container">
      <div class="table-header">
        <div>
          <h3>Recent Events Status Overview</h3>
          <p class="table-subtitle">
            Master registry of all events managed across the Gatherly platform.
          </p>
        </div>
        <button
          class="btn-manage-link"
          @click="router.push('/dashboard/events')"
        >
          Open Event Management &rarr;
        </button>
      </div>

      <table class="data-table">
        <thead>
          <tr>
            <th>Event Title</th>
            <th>Category</th>
            <th>Date &amp; Location</th>
            <th>Quota</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="events.length === 0">
            <td colspan="5" class="empty-table-cell">
              <div class="empty-table-content">
                <span class="empty-icon">📊</span>
                <p>No events recorded in the system yet.</p>
                <AppButton
                  variant="primary"
                  @click="router.push('/dashboard/events')"
                >
                  Create First Event
                </AppButton>
              </div>
            </td>
          </tr>

          <tr v-for="item in events" :key="item.id">
            <td class="font-semibold">{{ item.title }}</td>
            <td>
              <span class="category-badge">{{ item.cat }}</span>
            </td>
            <td>{{ item.date }} &bull; {{ item.loc }}</td>
            <td>{{ item.quota }} Pax</td>
            <td>
              <span
                :class="[
                  'status-badge',
                  item.done ? 'status-completed' : 'status-active',
                ]"
              >
                {{ item.done ? "Completed" : "Active" }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.dashboard-overview {
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-4);
  margin-bottom: var(--space-8);
}

.dashboard-header h2 {
  color: var(--text-main);
  font-size: 2rem;
  margin-bottom: var(--space-1);
}

.subtitle {
  color: var(--text-muted);
  font-size: 1rem;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--space-6);
  margin-bottom: var(--space-8);
}

.metric-card {
  padding: var(--space-6);
  text-align: left;
}

.metric-card h3 {
  color: var(--text-muted);
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  margin-bottom: var(--space-2);
  text-transform: uppercase;
}

.metric-value {
  color: var(--primary);
  font-size: 2.6rem;
  font-weight: 800;
  line-height: 1;
  margin-bottom: var(--space-2);
}

.metric-hint {
  color: var(--text-muted);
  font-size: 0.85rem;
}

.text-success {
  color: #2ecc71 !important;
}

.text-muted {
  color: #8a8d93 !important;
}

.data-table-container {
  padding: var(--space-6);
  background: white;
  border: 1px solid var(--border-color);
  border-radius: var(--space-4);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
}

.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-6);
}

.table-header h3 {
  font-size: 1.3rem;
  margin-bottom: var(--space-1);
}

.table-subtitle {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.btn-manage-link {
  padding: 0;
  color: var(--primary);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  background: none;
  border: none;
}

.btn-manage-link:hover {
  text-decoration: underline;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: var(--space-3) var(--space-4);
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.data-table th {
  color: var(--text-muted);
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  background: var(--bg-light);
}

.font-semibold {
  color: var(--text-main);
  font-weight: 600;
}

.category-badge {
  padding: 4px 10px;
  color: var(--primary);
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  background: rgba(102, 68, 255, 0.1);
  border-radius: 50px;
}

.status-badge {
  padding: 4px 10px;
  font-size: 0.8rem;
  font-weight: 700;
  border-radius: 50px;
}

.status-active {
  color: #27ae60;
  background: rgba(46, 204, 113, 0.15);
}

.status-completed {
  color: #6c757d;
  background: rgba(108, 117, 125, 0.15);
}

.empty-table-cell {
  padding: var(--space-12) var(--space-4);
  text-align: center;
  background: var(--bg-light);
}

.empty-table-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
}

.empty-table-content .empty-icon {
  font-size: 2.5rem;
}

.empty-table-content p {
  color: var(--text-muted);
  margin-bottom: var(--space-2);
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
