<template>
  <q-popup-edit v-model="model" class="py-3 column gap-3" ref="popupEdit" anchor="top end" separate-close-popup>
    <div class="text-subtitle1 font-medium">Edit {{ label }}</div>
    <q-banner class="bg-rose-200 rounded-md text-body1" inline-actions v-show="fieldMutation.isError">
      {{ fieldMutation.error?.message }}
      <template #action>
        <q-btn flat icon="mdi-close-circle" round dense @click="fieldMutation.reset" />
      </template>
    </q-banner>
    <q-form class="row gap-[6px] w-fit" @submit.stop="submit">
      <q-input v-model="model" autofocus type="date" outlined :label="label" bottom-slots class="text-body1" :required="required" :clearable="!required">
        <template #prepend>
          <q-icon name="mdi-calendar"></q-icon>
        </template>
        <template #append>
          <DateChooser v-model="model" :required="required"></DateChooser>
        </template>
      </q-input>
      <q-btn icon="mdi-arrow-right" color="primary" class="h-[56px] rounded-md" padding="sm" dense unelevated type="submit" :loading="fieldMutation.isPending" :disabled="fieldMutation.isPending">
        <template #loading>
          <q-spinner-ios></q-spinner-ios>
        </template>
      </q-btn>
    </q-form>
  </q-popup-edit>
</template>

<script setup>
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useAxiosAsync } from 'src/composables/api'
import { reactive, ref } from 'vue'
import DateChooser from 'src/components/DateChooser.vue'

const queryClient = useQueryClient()
const props = defineProps({
  label: { type: String, required: true },
  field: { type: String, required: true },
  originalValue: { type: [String, Number, null], required: true },
  endpoint: { type: String, required: true },
  rowId: { type: [String, Number], required: true },
  queryKeyToUpdate: { type: Array, required: true },
  queryKeysToInvalidate: { type: Array, required: true },
  required: { type: Boolean, default: false }
})
const model = ref(props.originalValue)
const popupEdit = ref(null)
const fieldMutation = reactive(useMutation({
  mutationFn: async () => await useAxiosAsync({
    method: 'PATCH',
    url: `${props.endpoint}/${props.rowId}`,
    data: { [props.field]: model.value },
    successNotif: true
  })
}))
function submit () {
  fieldMutation.mutateAsync()
    .then((data) => {
      queryClient.setQueryData(props.queryKeyToUpdate, data)
      for (const key of props.queryKeysToInvalidate) {
        queryClient.invalidateQueries({ queryKey: key })
      }
      popupEdit.value.cancel()
    })
}
</script>
