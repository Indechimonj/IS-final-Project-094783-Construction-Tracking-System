<template>
  <q-banner class="bg-rose-200 rounded-md text-body1" inline-actions v-show="mutation.isError">
    {{ mutation.error?.message }}
    <template v-slot:action>
      <q-btn flat icon="mdi-close-circle" round dense @click="mutation.reset" />
    </template>
  </q-banner>
</template>

<script setup>
defineProps({
  mutation: {
    error: { type: Error, required: true },
    reset: { type: Function, required: true },
    isError: { type: Boolean, required: true }
  }
})
</script>
