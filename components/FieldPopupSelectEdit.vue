<template>
  <q-popup-edit v-model="model" class="py-3 column gap-3" ref="popupEdit" anchor="top left">
    <div class="text-subtitle1 font-medium">Edit {{ label }}</div>
    <q-banner class="bg-rose-200 rounded-md text-body1" inline-actions v-show="fieldMutation.isError">
      {{ fieldMutation.error?.message }}
      <template #action>
        <q-btn flat icon="mdi-close-circle" round dense @click="fieldMutation.reset" />
      </template>
    </q-banner>
    <q-form class="row gap-[6px] w-fit" @submit.stop="submit">
      <q-select v-model="model" autofocus outlined :label="label" emit-value map-options :options="options" bottom-slots>
        <template #prepend>
          <q-icon :name="icon"></q-icon>
        </template>
      </q-select>
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

const queryClient = useQueryClient()
const props = defineProps({
  icon: { type: String, default: 'mdi-pencil' },
  label: { type: String, required: true },
  field: { type: String, required: true },
  originalValue: { type: [String, Number, null], required: true },
  options: { type: Object, required: true },
  endpoint: { type: String, required: true },
  rowId: { type: [String, Number], required: true },
  queryKeyToUpdate: { type: Array, required: true },
  queryKeysToInvalidate: { type: Array, required: true }
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
