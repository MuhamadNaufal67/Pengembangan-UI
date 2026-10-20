<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useEvents } from "@/composables/useEvents";
import AppButton from "@/components/ui/AppButton.vue";
import AppCard from "@/components/ui/AppCard.vue";
import AppModal from "@/components/ui/AppModal.vue";

const router = useRouter();
const {
  activeEvents,
  completedEvents,
  createEvent,
  completeEvent,
  deleteEvent,
} = useEvents();

const currentTab = ref("active");

const form = reactive({
  title: "",
  cat: "Workshop",
  date: "",
  loc: "",
  quota: 100,
  price: "Free",
  desc: "",
});

const errorMessage = ref("");
const successMessage = ref("");

const isModalOpen = ref(false);
const modalAction = ref("complete");
const selectedEvent = ref(null);

const handleOpenCompleteModal = (event) => {
  selectedEvent.value = event;
  modalAction.value = "complete";
  isModalOpen.value = true;
};

const handleOpenDeleteModal = (event) => {
  selectedEvent.value = event;
  modalAction.value = "delete";
  isModalOpen.value = true;
};

const handleConfirmModal = () => {
  if (selectedEvent.value) {
    if (modalAction.value === "complete") {
      completeEvent(selectedEvent.value.id);
    } else if (modalAction.value === "delete") {
      deleteEvent(selectedEvent.value.id);
    }

    isModalOpen.value = false;
    selectedEvent.value = null;
  }
};

const handleCancelModal = () => {
  isModalOpen.value = false;
  selectedEvent.value = null;
};

const formatEventDate = (dateTime) => {
  if (!dateTime) return "";

  const dateObject = new Date(dateTime);
  if (isNaN(dateObject.getTime())) return dateTime;

  const datePart = dateObject.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
  const timePart = dateObject.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return `${datePart} • ${timePart}`;
};

const handleSubmitEvent = () => {
  if (
    !form.title.trim() ||
    !form.date ||
    !form.loc.trim() ||
    !form.desc.trim()
  ) {
    errorMessage.value =
      "Please fill in all required fields before publishing the event!";
    successMessage.value = "";
    return;
  }

  createEvent({
    title: form.title,
    cat: form.cat,
    date: formatEventDate(form.date),
    loc: form.loc,
    quota: form.quota,
    price: form.price,
    desc: form.desc,
  });

  form.title = "";
  form.date = "";
  form.loc = "";
  form.quota = 100;
  form.price = "Free";
  form.desc = "";
  errorMessage.value = "";
  successMessage.value = "Event published successfully and is now live!";

  setTimeout(() => {
    successMessage.value = "";
    currentTab.value = "active";
  }, 1000);
};
</script>

<template>
  <div class="event-management-page">
    <div class="page-header">
      <div>
        <h2>Event Management Control</h2>
        <p class="subtitle">
          Manage event lifecycle, publish new events, and archive completed
          ones.
        </p>
      </div>
      <AppButton variant="primary" @click="currentTab = 'create'">
        ➕ Create New Event
      </AppButton>
    </div>

    <div class="tabs-container">
      <button
        :class="['tab-btn', { active: currentTab === 'active' }]"
        @click="currentTab = 'active'"
      >
        ⚡ Active Events ({{ activeEvents.length }})
      </button>
      <button
        :class="['tab-btn', { active: currentTab === 'create' }]"
        @click="currentTab = 'create'"
      >
        ➕ Create Event
      </button>
      <button
        :class="['tab-btn', { active: currentTab === 'completed' }]"
        @click="currentTab = 'completed'"
      >
        ✅ Completed Events ({{ completedEvents.length }})
      </button>
    </div>

    <section v-if="currentTab === 'active'" class="tab-pane">
      <div v-if="activeEvents.length > 0" class="events-grid">
        <AppCard
          v-for="item in activeEvents"
          :key="item.id"
          class="organizer-event-card"
        >
          <div class="card-header">
            <span class="category-badge">{{ item.cat }}</span>
            <span class="status-badge status-active">Active</span>
          </div>

          <h3 class="event-title">{{ item.title }}</h3>
          <p class="event-meta">🗓️ {{ item.date }} &bull; {{ item.loc }}</p>
          <p class="event-desc">{{ item.desc }}</p>

          <div class="card-actions">
            <button
              class="btn-action btn-detail"
              @click="router.push(`/browse/events/${item.id}`)"
            >
              👁️ View Details
            </button>
            <button
              class="btn-action btn-complete"
              @click="handleOpenCompleteModal(item)"
            >
              ✅ Complete Event
            </button>
            <button
              class="btn-action btn-delete"
              @click="handleOpenDeleteModal(item)"
            >
              🗑️ Delete
            </button>
          </div>
        </AppCard>
      </div>

      <div v-else class="empty-state">
        <div class="empty-icon">📭</div>
        <h3>No Active Events</h3>
        <p>
          All events have ended or none have been created yet. Please create a
          new event.
        </p>
        <AppButton variant="primary" @click="currentTab = 'create'"
          >Create Event Now</AppButton
        >
      </div>
    </section>

    <section v-if="currentTab === 'create'" class="tab-pane">
      <AppCard class="form-card">
        <h3>Create New Event Form</h3>
        <p class="form-subtitle">
          Information entered here will be instantly published to the Gatherly
          public catalog.
        </p>

        <div v-if="errorMessage" class="alert-box alert-error">
          ⚠️ {{ errorMessage }}
        </div>
        <div v-if="successMessage" class="alert-box alert-success">
          ✅ {{ successMessage }}
        </div>

        <form class="event-form" @submit.prevent="handleSubmitEvent">
          <div class="form-group">
            <label>Event Title *</label>
            <input
              v-model="form.title"
              type="text"
              placeholder="e.g. Modern UI/UX Masterclass"
              class="form-input"
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Event Category *</label>
              <select v-model="form.cat" class="form-input">
                <option value="Workshop">Workshop</option>
                <option value="Meetup">Meetup</option>
                <option value="Competition">Competition</option>
                <option value="Seminar">Seminar</option>
                <option value="Conference">Conference</option>
              </select>
            </div>

            <div class="form-group">
              <label>Date &amp; Time *</label>
              <input
                v-model="form.date"
                type="datetime-local"
                class="form-input"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Event Location *</label>
              <input
                v-model="form.loc"
                type="text"
                placeholder="e.g. Innovation Center, Jakarta"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label>Attendee Quota</label>
              <input
                v-model.number="form.quota"
                type="number"
                min="10"
                placeholder="100"
                class="form-input"
              />
            </div>
          </div>

          <div class="form-group">
            <label>Event Description *</label>
            <textarea
              v-model="form.desc"
              rows="4"
              placeholder="Describe the agenda, speakers, and key takeaways..."
              class="form-input"
            ></textarea>
          </div>

          <div class="form-actions">
            <button
              type="button"
              class="btn-secondary-action"
              @click="currentTab = 'active'"
            >
              Cancel
            </button>
            <AppButton variant="primary" type="submit"
              >🚀 Publish Event Now</AppButton
            >
          </div>
        </form>
      </AppCard>
    </section>

    <section v-if="currentTab === 'completed'" class="tab-pane">
      <div v-if="completedEvents.length > 0" class="events-grid">
        <AppCard
          v-for="item in completedEvents"
          :key="item.id"
          class="organizer-event-card card-completed"
        >
          <div class="card-header">
            <span class="category-badge">{{ item.cat }}</span>
            <span class="status-badge status-completed">Completed</span>
          </div>

          <h3 class="event-title text-strike">{{ item.title }}</h3>
          <p class="event-meta">🗓️ {{ item.date }} &bull; {{ item.loc }}</p>
          <p class="event-desc">{{ item.desc }}</p>
          <div class="completed-notice">
            🔒 This event has ended and is archived from the public catalog.
          </div>

          <div class="card-actions">
            <button
              class="btn-action btn-delete"
              @click="handleOpenDeleteModal(item)"
            >
              🗑️ Delete from Archive
            </button>
          </div>
        </AppCard>
      </div>

      <div v-else class="empty-state">
        <div class="empty-icon">☑️</div>
        <h3>No Completed Events</h3>
        <p>Events marked as completed will be archived here permanently.</p>
      </div>
    </section>

    <AppModal
      :is-open="isModalOpen"
      :title="
        modalAction === 'complete'
          ? 'Complete Event'
          : 'Delete Event Permanently'
      "
      :message="
        modalAction === 'complete'
          ? `Are you sure you want to mark '${selectedEvent?.title}' as completed? Once completed, the status is final and the event will be automatically removed from public listings.`
          : `Are you sure you want to permanently delete '${selectedEvent?.title}'? This action cannot be undone and will permanently remove this event from all records.`
      "
      :confirm-text="
        modalAction === 'complete' ? 'Yes, Complete' : 'Yes, Delete Permanently'
      "
      cancel-text="Cancel"
      @confirm="handleConfirmModal"
      @close="handleCancelModal"
    />
  </div>
</template>

<style scoped>
.event-management-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-4);
  margin-bottom: var(--space-8);
}

.page-header h2 {
  color: var(--text-main);
  font-size: 2rem;
  margin-bottom: var(--space-1);
}

.subtitle {
  color: var(--text-muted);
  font-size: 1rem;
}

.tabs-container {
  display: flex;
  gap: var(--space-3);
  padding-bottom: var(--space-2);
  margin-bottom: var(--space-8);
  border-bottom: 2px solid var(--border-color);
}

.tab-btn {
  padding: var(--space-3) var(--space-6);
  color: var(--text-muted);
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  background: none;
  border: none;
  border-radius: 8px;
  transition: all 0.2s;
}

.tab-btn:hover {
  color: var(--primary);
  background-color: rgba(102, 68, 255, 0.05);
}

.tab-btn.active {
  color: white;
  background-color: var(--primary);
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-6);
  margin-bottom: var(--space-12);
}

.organizer-event-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: var(--space-6);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-3);
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

.event-title {
  color: var(--text-main);
  font-size: 1.3rem;
  margin-bottom: var(--space-2);
}

.text-strike {
  color: #8a8d93;
  text-decoration: line-through;
}

.card-completed {
  opacity: 0.85;
  background-color: #fafbfc;
}

.event-meta {
  color: var(--text-muted);
  font-size: 0.9rem;
  margin-bottom: var(--space-3);
}

.event-desc {
  flex-grow: 1;
  color: var(--text-muted);
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: var(--space-6);
}

.completed-notice {
  padding: var(--space-3);
  color: #8f5937;
  font-size: 0.85rem;
  margin-bottom: var(--space-4);
  background: #f1f3f5;
  border-radius: 6px;
}

.card-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  padding-top: var(--space-4);
  border-top: 1px solid var(--border-color);
}

.btn-action {
  flex: 1;
  padding: var(--space-2) var(--space-3);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  transition: all 0.2s;
}

.btn-detail:hover {
  color: var(--primary);
  background: var(--bg-light);
  border-color: var(--primary);
}

.btn-complete {
  color: #27ae60;
  border-color: rgba(39, 174, 96, 0.3);
}

.btn-complete:hover {
  color: white;
  background: #27ae60;
}

.btn-delete {
  flex: 0 0 auto;
  color: #e63946;
  border-color: rgba(230, 57, 70, 0.3);
}

.btn-delete:hover {
  color: white;
  background: #e63946;
}

.empty-state {
  padding: var(--space-12);
  margin-bottom: var(--space-12);
  text-align: center;
  background: white;
  border: 1px dashed var(--border-color);
  border-radius: var(--space-4);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: var(--space-3);
}

.empty-state h3 {
  font-size: 1.4rem;
  margin-bottom: var(--space-2);
}

.empty-state p {
  color: var(--text-muted);
  margin-bottom: var(--space-6);
}

.form-card {
  max-width: 800px;
  padding: var(--space-8);
  margin: 0 auto var(--space-12);
}

.form-card h3 {
  font-size: 1.5rem;
  margin-bottom: var(--space-1);
}

.form-subtitle {
  color: var(--text-muted);
  margin-bottom: var(--space-6);
}

.alert-box {
  padding: var(--space-3) var(--space-4);
  font-size: 0.95rem;
  font-weight: 500;
  margin-bottom: var(--space-6);
  border-radius: 8px;
}

.alert-error {
  color: #c92a2a;
  background: #ffe3e3;
  border: 1px solid #ffa8a8;
}

.alert-success {
  color: #2b8a3e;
  background: #d3f9d8;
  border: 1px solid #b2f2bb;
}

.event-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.form-group label {
  color: var(--text-main);
  font-size: 0.95rem;
  font-weight: 600;
}

.form-input {
  padding: var(--space-3) var(--space-4);
  font-size: 1rem;
  outline: none;
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  transition: border-color 0.2s;
}

.form-input:focus {
  border-color: var(--primary);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-4);
  margin-top: var(--space-4);
}

.btn-secondary-action {
  padding: var(--space-3) var(--space-6);
  color: var(--text-muted);
  font-weight: 600;
  cursor: pointer;
  background: var(--bg-light);
  border: 1px solid var(--border-color);
  border-radius: 12px;
}

.btn-secondary-action:hover {
  color: var(--text-main);
  background: #e2e8f0;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
