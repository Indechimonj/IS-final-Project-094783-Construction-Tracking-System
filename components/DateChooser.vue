<template>
  <q-btn flat round dense icon="mdi-calendar-cursor">
    <q-popup-proxy cover transition-show="scale" transition-hide="scale" ref="dateProxy">
      <DateInput v-model="model" @update:model-value="dateProxy.hide()"></DateInput>
    </q-popup-proxy>
  </q-btn>
</template>

<script setup>
import DateInput from 'src/components/DateInput.vue'
import { ref } from 'vue'

const model = defineModel({ required: true })
const dateProxy = ref(null)
</script>
