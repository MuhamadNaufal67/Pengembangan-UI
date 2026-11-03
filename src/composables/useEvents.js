import { computed, ref, watch } from "vue";

const eventCacheKey = "gatherly_events";
const registrationsKey = "gatherly_user_registrations";
const events = ref(JSON.parse(localStorage.getItem(eventCacheKey) || "[]"));
const userRegistrations = ref(
  JSON.parse(localStorage.getItem(registrationsKey) || "[]"),
);
const loading = ref(false);
const error = ref(null);

const apiBaseUrl = () =>
  (import.meta.env.VITE_API_URL || "").trim().replace(/\/+$/, "");
const configured = () => {
  const url = apiBaseUrl();
  return url && !url.includes("YOUR_MOCKAPI_PROJECT_ID");
};
const normalize = (event) => ({
  ...event,
  quota: Number(event.quota) || 0,
  done: event.done === true || event.done === "true",
});

watch(
  events,
  (value) => localStorage.setItem(eventCacheKey, JSON.stringify(value)),
  { deep: true },
);
watch(
  userRegistrations,
  (value) => localStorage.setItem(registrationsKey, JSON.stringify(value)),
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
    events.value.find((event) => String(event.id) === String(id));

  const fetchEvents = async () => {
    loading.value = true;
    error.value = null;
    try {
      if (!configured())
        throw new Error(
          "Alamat REST API belum dikonfigurasi. Masukkan URL MockAPI Anda di file .env.",
        );
      const response = await fetch(`${apiBaseUrl()}/events`);
      if (!response.ok)
        throw new Error(
          `Gagal memuat data dari server (HTTP ${response.status}).`,
        );
      events.value = (await response.json()).map(normalize);
    } catch (err) {
      error.value =
        err.message ||
        "Terjadi kegagalan jaringan saat menghubungi server API.";
    } finally {
      loading.value = false;
    }
  };

  const fetchEventById = async (id) => {
    const cached = getEventById(id);
    if (cached) return cached;
    loading.value = true;
    error.value = null;
    try {
      if (!configured())
        throw new Error("Alamat REST API belum dikonfigurasi.");
      const response = await fetch(`${apiBaseUrl()}/events/${id}`);
      if (!response.ok)
        throw new Error(
          response.status === 404
            ? "Acara tidak ditemukan pada server."
            : `Gagal mengambil detail acara (HTTP ${response.status}).`,
        );
      const event = normalize(await response.json());
      events.value.push(event);
      return event;
    } catch (err) {
      error.value = err.message;
      return null;
    } finally {
      loading.value = false;
    }
  };

  const createEvent = async (data) => {
    loading.value = true;
    error.value = null;
    const payload = {
      title: data.title.trim(),
      cat: data.cat,
      date: data.date,
      loc: data.loc.replace(/^📍\s*/, "").trim(),
      quota: Number(data.quota) || 100,
      price: data.price || "Free",
      desc: data.desc.trim(),
      done: false,
    };
    try {
      if (!configured())
        throw new Error("Alamat REST API belum dikonfigurasi.");
      const response = await fetch(`${apiBaseUrl()}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok)
        throw new Error(
          `Gagal menyimpan acara ke server (HTTP ${response.status}).`,
        );
      const created = normalize(await response.json());
      events.value.unshift(created);
      return created;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteEvent = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      if (!configured())
        throw new Error("Alamat REST API belum dikonfigurasi.");
      const response = await fetch(`${apiBaseUrl()}/events/${id}`, {
        method: "DELETE",
      });
      if (!response.ok && response.status !== 404)
        throw new Error(
          `Gagal menghapus acara dari server (HTTP ${response.status}).`,
        );
      events.value = events.value.filter(
        (event) => String(event.id) !== String(id),
      );
      userRegistrations.value = userRegistrations.value.filter(
        (registration) => String(registration.eventId) !== String(id),
      );
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const completeEvent = async (id) => {
    const event = getEventById(id);
    if (!event) return;
    event.done = true;
    if (!configured()) return;
    try {
      await fetch(`${apiBaseUrl()}/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...event, done: true }),
      });
    } catch {
      /* UI keeps local completed state */
    }
  };

  const registerAttendee = (eventId, participant) => {
    const event = getEventById(eventId);
    if (!event || event.done || event.quota <= 0 || isUserRegistered(eventId))
      return null;
    const record = {
      id: Date.now(),
      eventId: event.id,
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
    event.quota -= 1;
    userRegistrations.value.unshift(record);
    return record;
  };
  const isUserRegistered = (id) =>
    !!getEventById(id) &&
    userRegistrations.value.some(
      (registration) => String(registration.eventId) === String(id),
    );
  const getRegistrationByEventId = (id) =>
    userRegistrations.value.find(
      (registration) => String(registration.eventId) === String(id),
    );
  const cancelRegistration = (id) => {
    const index = userRegistrations.value.findIndex(
      (registration) => String(registration.eventId) === String(id),
    );
    if (index < 0) return false;
    userRegistrations.value.splice(index, 1);
    const event = getEventById(id);
    if (event) event.quota += 1;
    return true;
  };
  const clearAllEvents = () => {
    events.value = [];
    localStorage.removeItem(eventCacheKey);
  };
  const clearAllRegistrations = () => {
    userRegistrations.value = [];
    localStorage.removeItem(registrationsKey);
  };
  return {
    events,
    loading,
    error,
    totalEvents,
    activeEvents,
    completedEvents,
    userRegistrations,
    totalRegistrations,
    fetchEvents,
    fetchEventById,
    createEvent,
    deleteEvent,
    completeEvent,
    getEventById,
    registerAttendee,
    isUserRegistered,
    getRegistrationByEventId,
    cancelRegistration,
    clearAllEvents,
    clearAllRegistrations,
  };
}
