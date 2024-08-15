<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-card class="q-dialog-plugin rounded-md">
      <q-card-section class="p-0">
        <q-form @submit.stop="submit" class="column gap-y-">
          <div class="row mx-4 py-3 items-center">
            <q-btn icon="arrow_back" round flat padding="0px" v-close-popup dense></q-btn>
            <h5 class="text-h5 font-medium mx-auto">New Resource</h5>
          </div>
          <q-banner class="bg-rose-200 rounded-md text-body1 mx-4 mb-2" inline-actions v-show="createResourceMutation.isError">
            {{ createResourceMutation.error?.message }}
            <template v-slot:action>
              <q-btn flat icon="mdi-close-circle" round dense @click="createResourceMutation.reset" />
            </template>
          </q-banner>
          <q-separator></q-separator>
          <q-input v-model="formData.name" type="text" borderless label="Name" required class="text-body1 mx-4" clearable clear-icon="close" stack-label placeholder="Add Name" label-color="primary">
            <template #prepend>
              <q-icon name="mdi-tag-text-outline"></q-icon>
            </template>
          </q-input>
          <q-separator></q-separator>
          <q-input v-model="formData.description" type="text" borderless label="Description" class="text-body1 mx-4" autogrow clearable clear-icon="close" required stack-label placeholder="Add Description" label-color="primary">
            <template #prepend>
              <q-icon name="mdi-text"></q-icon>
            </template>
          </q-input>
          <q-separator></q-separator>
          <q-select borderless required v-model="formData.type" :options="typeOptions" emit-value map-options label="Type" class="text-body1 mx-4" label-color="primary">
            <template #prepend>
              <q-icon name="mdi-label-multiple-outline"></q-icon>
            </template>
          </q-select>
          <q-separator></q-separator>
          <q-input v-model="formData.units" type="text" borderless label="Units" required class="text-body1 mx-4" stack-label placeholder="Add Units" label-color="primary" clearable clear-icon="close">
            <template #prepend>
              <q-icon name="mdi-beaker-question-outline"></q-icon>
            </template>
          </q-input>
          <q-separator></q-separator>
          <q-btn label="Create Resource" class="w-fit self-end rounded-md m-4" color="primary" type="submit" :loading="createResourceMutation.isPending" :disabled="createResourceMutation.isPending">
          <template #loading>
            <q-spinner-ios></q-spinner-ios><span class="ml-2">Loading...</span>
          </template>
        </q-btn>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useDialogPluginComponent } from 'quasar'
import { createResource } from 'src/composables/api'
import { reactive } from 'vue'

const props = defineProps({
  projectId: {
    type: [String, Number],
    required: true
  }
})

const formData = reactive({
  name: '',
  description: '',
  type: 'material',
  units: '',
  projectId: props.projectId
})

const typeOptions = [
  { label: 'Material', value: 'material' },
  { label: 'Equipment', value: 'equipment' },
  { label: 'Labour', value: 'labour' }
]
const createResourceMutation = reactive(useMutation({
  mutationFn: createResource
}))
const queryClient = useQueryClient()
function submit () {
  createResourceMutation.mutateAsync(formData)
    .then(() => {
      queryClient.invalidateQueries({ queryKey: ['resources', { projectId: props.projectId }] })
      onDialogOK()
    })
}

defineEmits([
  ...useDialogPluginComponent.emits
])

const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent()
</script>
