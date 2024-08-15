<template>
  <q-date v-model="model" today-btn mask="YYYY-MM-DD" emit-immediately :default-year-month="formatDate(new Date(), 'YYYY/MM')"></q-date>
</template>

<script setup>
import { date } from 'quasar'
const { formatDate } = date
const model = defineModel({ required: true })
</script>
