import { computed, ref, watch } from "vue";

const EVENTS_STORAGE_KEY = "gatherly_events";
const REGISTRATIONS_STORAGE_KEY = "gatherly_user_registrations";
const events = ref(
  JSON.parse(localStorage.getItem(EVENTS_STORAGE_KEY) || "[]"),
);
const userRegistrations = ref(
  JSON.parse(localStorage.getItem(REGISTRATIONS_STORAGE_KEY) || "[]"),
);

watch(
  events,
  (value) => localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(value)),
  { deep: true },
);
watch(
  userRegistrations,
  (value) =>
    localStorage.setItem(REGISTRATIONS_STORAGE_KEY, JSON.stringify(value)),
  { deep: true },
);

export function useEvents() {
  const totalEvents = computed(() => events.value.length);
  const activeEvents = computed(() =>
    events.value.filter((event) => !event.done),
  );
  const completedEvents = computed(() =>
    events.value.filter((event) => event.done),
  );
  const totalRegistrations = computed(() => userRegistrations.value.length);
  const getEventById = (id) =>
    events.value.find((event) => event.id === Number(id));

  const createEvent = (data) => {
    const cleanLocation = data.loc.replace(/^📍\s*/, "").trim();
    const event = {
      id: Date.now(),
      title: data.title.trim(),
      date: data.date,
      loc: `📍 ${cleanLocation}`,
      cat: data.cat,
      quota: Number(data.quota) || 100,
      price: data.price || "Free",
      desc: data.desc.trim(),
      done: false,
    };
    events.value.unshift(event);
    return event;
  };
  const completeEvent = (id) => {
    const event = getEventById(id);
    if (event) event.done = true;
  };
  const deleteEvent = (id) => {
    const eventId = Number(id);
    const index = events.value.findIndex((event) => event.id === eventId);
    if (index !== -1) events.value.splice(index, 1);
    userRegistrations.value = userRegistrations.value.filter(
      (registration) => registration.eventId !== eventId,
    );
  };
  const isUserRegistered = (id) =>
    !!getEventById(id) &&
    userRegistrations.value.some(
      (registration) => registration.eventId === Number(id),
    );
  const registerAttendee = (eventId, participant) => {
    const event = getEventById(eventId);
    if (!event || event.done || event.quota <= 0 || isUserRegistered(eventId))
      return null;
    const record = {
      id: Date.now(),
      eventId: Number(eventId),
      eventTitle: event.title,
      eventCat: event.cat,
      eventDate: event.date,
      eventLoc: event.loc,
      bookingCode: `GTH-${Date.now().toString().slice(-4)}`,
      registeredAt: new Date().toISOString(),
      fullName: participant.fullName.trim(),
      email: participant.email.trim(),
      phone: participant.phone.trim(),
      dob: participant.dob,
      reason: participant.reason.trim(),
    };
    event.quota = Math.max(0, event.quota - 1);
    userRegistrations.value.unshift(record);
    return record;
  };
  const getRegistrationByEventId = (id) =>
    userRegistrations.value.find(
      (registration) => registration.eventId === Number(id),
    );
  const cancelRegistration = (id) => {
    const index = userRegistrations.value.findIndex(
      (registration) => registration.eventId === Number(id),
    );
    if (index === -1) return false;
    userRegistrations.value.splice(index, 1);
    const event = getEventById(id);
    if (event) event.quota += 1;
    return true;
  };
  const clearAllEvents = () => {
    events.value = [];
    userRegistrations.value = [];
    localStorage.removeItem(EVENTS_STORAGE_KEY);
    localStorage.removeItem(REGISTRATIONS_STORAGE_KEY);
  };
  const clearAllRegistrations = () => {
    userRegistrations.value = [];
    localStorage.removeItem(REGISTRATIONS_STORAGE_KEY);
  };

  return {
    events,
    totalEvents,
    activeEvents,
    completedEvents,
    userRegistrations,
    totalRegistrations,
    createEvent,
    completeEvent,
    deleteEvent,
    getEventById,
    registerAttendee,
    isUserRegistered,
    getRegistrationByEventId,
    cancelRegistration,
    clearAllEvents,
    clearAllRegistrations,
  };
}
