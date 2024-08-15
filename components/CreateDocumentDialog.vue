<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-card class="q-dialog-plugin rounded-md">
      <q-card-section class="p-0">
        <q-form @submit.stop="submit" class="column gap-y-">
          <div class="flex justify-between px-4 py-3 items-center">
            <h5 class="text-h5 font-medium">New Document</h5>
            <q-btn icon="close" round flat unelevated v-close-popup></q-btn>
          </div>
          <q-banner class="bg-rose-200 rounded-md text-body1 mx-4 mb-2" inline-actions v-show="createDocumentMutation.isError">
            {{ createDocumentMutation.error?.message }}
            <template v-slot:action>
              <q-btn flat icon="mdi-close-circle" round dense @click="createDocumentMutation.reset" />
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
          <q-file borderless required v-model="formData.file" label="Pick File" class="text-body1 mx-4" label-color="primary" clearable clear-icon="close">
            <template #prepend>
              <q-icon name="mdi-file-upload-outline"></q-icon>
            </template>
          </q-file>
          <q-separator></q-separator>
          <q-btn label="Create Document" class="w-fit self-end rounded-md m-4" color="primary" type="submit" :loading="createDocumentMutation.isPending" :disabled="createDocumentMutation.isPending">
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
import { createDocument } from 'src/composables/api'
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
  file: null
})

const createDocumentMutation = reactive(useMutation({
  mutationFn: createDocument
}))
const queryClient = useQueryClient()
function submit () {
  const data = new FormData()
  data.append('name', formData.name)
  data.append('description', formData.description)
  data.append('file', formData.file)
  data.append('projectId', props.projectId)
  createDocumentMutation.mutateAsync(data)
    .then(() => {
      queryClient.invalidateQueries({ queryKey: ['documents', { projectId: props.projectId }] })
      onDialogOK()
    })
}

defineEmits([
  ...useDialogPluginComponent.emits
])

const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent()
</script>
