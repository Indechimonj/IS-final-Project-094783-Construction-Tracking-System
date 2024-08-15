<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-card class="q-dialog-plugin rounded-md">
      <q-card-section class="p-0">
        <q-form @submit.stop="submit" class="column gap-y-">
          <div class="flex justify-between px-4 py-3 items-center">
            <h5 class="text-h5 font-medium">New Issue</h5>
            <q-btn icon="close" round flat unelevated v-close-popup></q-btn>
          </div>
          <q-banner class="bg-rose-200 rounded-md text-body1 mx-4 mb-2" inline-actions v-show="createIssueMutation.isError">
            {{ createIssueMutation.error?.message }}
            <template v-slot:action>
              <q-btn flat icon="mdi-close-circle" round dense @click="createIssueMutation.reset" />
            </template>
          </q-banner>
          <q-separator></q-separator>
          <q-input v-model="formData.title" type="text" borderless label="Title" required class="text-body1 mx-4" clearable clear-icon="close" stack-label placeholder="Add Title" label-color="primary">
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
          <q-select borderless required v-model="formData.priority" :options="priorityOptions" emit-value map-options label="Priority" class="text-body1 mx-4" label-color="primary">
            <template #prepend>
              <q-icon name="mdi-label-multiple-outline"></q-icon>
            </template>
          </q-select>
          <q-separator></q-separator>
          <q-btn label="Create Issue" class="w-fit self-end rounded-md m-4" color="primary" type="submit" :loading="createIssueMutation.isPending" :disabled="createIssueMutation.isPending">
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
import { createIssue } from 'src/composables/api'
import { reactive } from 'vue'

const props = defineProps({
  projectId: {
    type: [String, Number],
    required: true
  }
})

const formData = reactive({
  title: '',
  description: '',
  priority: 'low',
  projectId: props.projectId
})

const priorityOptions = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' }
]
const createIssueMutation = reactive(useMutation({
  mutationFn: createIssue
}))
const queryClient = useQueryClient()
function submit () {
  createIssueMutation.mutateAsync(formData)
    .then(() => {
      queryClient.invalidateQueries({ queryKey: ['issues', { projectId: props.projectId }] })
      onDialogOK()
    })
}

defineEmits([
  ...useDialogPluginComponent.emits
])

const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent()
</script>
