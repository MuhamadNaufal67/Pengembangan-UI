<script setup>
import { reactive } from "vue";
const emit = defineEmits(["submit", "cancel"]);
const form = reactive({
  title: "",
  cat: "Workshop",
  date: "",
  loc: "",
  quota: 100,
  price: "Free",
  desc: "",
});
const submit = () => emit("submit", { ...form });
</script>
<template>
  <form @submit.prevent="submit">
    <input v-model="form.title" placeholder="Event title" required /><select
      v-model="form.cat"
    >
      <option>Workshop</option>
      <option>Meetup</option>
      <option>Seminar</option></select
    ><input v-model="form.date" type="datetime-local" required /><input
      v-model="form.loc"
      placeholder="Location"
      required
    /><input v-model.number="form.quota" type="number" /><textarea
      v-model="form.desc"
      placeholder="Description"
      required
    ></textarea
    ><button type="button" @click="$emit('cancel')">Cancel</button
    ><button>Create Event</button>
  </form>
</template>
