<script setup>
import { computed, reactive, ref } from "vue";
import { useEvents } from "@/composables/useEvents";
const props = defineProps({ event: { type: Object, required: true } });
const emit = defineEmits(["success", "cancel"]);
const { registerAttendee } = useEvents();
const form = reactive({
  fullName: "",
  email: "",
  phone: "",
  dob: "",
  reason: "",
});
const errors = reactive({
  fullName: "",
  email: "",
  phone: "",
  dob: "",
  reason: "",
});
const dirty = computed(() =>
  Object.values(form).some((value) => String(value).trim()),
);
const validate = () => {
  errors.fullName =
    form.fullName.trim().length >= 2
      ? ""
      : "Full name must be at least 2 characters.";
  errors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    ? ""
    : "Please enter a valid email address.";
  errors.phone = /^[0-9+\-\s]{8,}$/.test(form.phone)
    ? ""
    : "Please enter a valid phone number.";
  errors.dob =
    form.dob && new Date(form.dob) <= new Date()
      ? ""
      : "Please enter a valid date of birth.";
  errors.reason =
    form.reason.trim().length >= 10
      ? ""
      : "Reason must be at least 10 characters.";
  return !Object.values(errors).some(Boolean);
};
const submit = () => {
  if (!validate()) return;
  const result = registerAttendee(props.event.id, form);
  if (result) emit("success", result);
};
const cancel = () => {
  if (!dirty.value || confirm("Discard your registration form?"))
    emit("cancel");
};
</script>
<template>
  <form class="form" @submit.prevent="submit">
    <h2>Complete Your Registration</h2>
    <p>Fields marked * are required.</p>
    <label
      >Full Name *<input v-model="form.fullName" @blur="validate" /><small>{{
        errors.fullName
      }}</small></label
    ><label
      >Email Address *<input
        v-model="form.email"
        type="email"
        @blur="validate"
      /><small>{{ errors.email }}</small></label
    ><label
      >Phone Number *<input v-model="form.phone" @blur="validate" /><small>{{
        errors.phone
      }}</small></label
    ><label
      >Date of Birth *<input
        v-model="form.dob"
        type="date"
        @blur="validate"
      /><small>{{ errors.dob }}</small></label
    ><label
      >Why do you want to attend? *<textarea
        v-model="form.reason"
        rows="4"
        @blur="validate"
      /><small>{{ errors.reason }}</small></label
    >
    <div>
      <button type="button" @click="cancel">Cancel</button
      ><button type="submit">Confirm Registration</button>
    </div>
  </form>
</template>
<style scoped>
.form {
  padding: var(--space-6);
  background: white;
  border: 1px solid var(--border-color);
  border-radius: var(--space-4);
  display: grid;
  gap: var(--space-4);
}
.form h2,
.form p {
  margin: 0;
}
.form p {
  color: var(--text-muted);
}
label {
  display: grid;
  gap: var(--space-2);
  font-weight: 600;
}
input,
textarea {
  padding: var(--space-3);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font: inherit;
}
small {
  min-height: 1em;
  color: #d62828;
  font-weight: 400;
}
.form div {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
}
button {
  padding: var(--space-3) var(--space-5);
  cursor: pointer;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  font-weight: 600;
}
button[type="submit"] {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
}
</style>
