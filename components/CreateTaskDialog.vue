<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin rounded-md">
      <q-card-section class="p-6">
        <q-form @submit.stop="submit" class="column gap-y-4">
          <div class="flex">
            <h4 class="text-h4 mx-auto">New Task</h4>
            <q-btn icon="close" round flat unelevated v-close-popup></q-btn>
          </div>
          <q-banner class="bg-rose-200 rounded-md text-body1" inline-actions v-show="createTaskMutation.isError">
            {{ createTaskMutation.error?.message }}
            <template v-slot:action>
              <q-btn flat icon="mdi-close-circle" round dense @click="createTaskMutation.reset" />
            </template>
          </q-banner>
          <q-input v-model="formData.title" type="text" outlined label="Title" stack-label label-color="primary" placeholder="Enter Title" required class="text-body1">
            <template #prepend>
              <q-icon name="mdi-tag-outline"></q-icon>
            </template>
          </q-input>
          <q-input v-model="formData.description" type="text" outlined label="Task Description (Optional)" stack-label label-color="primary" placeholder="Enter Description" class="text-body1" autogrow>
            <template #prepend>
              <q-icon name="mdi-text"></q-icon>
            </template>
          </q-input>
          <q-input v-model="formData.dueDate" type="date" outlined label="Due Date" required class="text-body1">
            <template #prepend>
              <q-icon name="mdi-calendar"></q-icon>
            </template>
            <template #append>
              <DateChooser v-model="formData.dueDate"></DateChooser>
            </template>
          </q-input>
          <q-input v-model="formData.budget" type="number" outlined label="Budget" stack-label label-color="primary" placeholder="Enter Budget" required class="text-body1">
            <template #prepend>
              <q-icon name="mdi-cash-multiple"></q-icon>
            </template>
          </q-input>
          <div class="grid grid-cols-2 gap-3">
            <q-select outlined required v-model="formData.status" :options="statusOptions" emit-value map-options label="Status">
              <template #prepend>
                <q-icon name="mdi-progress-check"></q-icon>
              </template>
            </q-select>
            <q-select outlined required v-model="formData.priority" :options="priorityOptions" emit-value map-options label="Priority">
              <template #prepend>
                <q-icon name="mdi-email"></q-icon>
              </template>
            </q-select>
          </div>
          <q-btn label="Create Task" class="w-full rounded-md" size="lg" color="primary" type="submit" :loading="createTaskMutation.isPending" :disabled="createTaskMutation.isPending">
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
import { createTask } from 'src/composables/api'
import { reactive } from 'vue'
import DateChooser from 'src/components/DateChooser.vue'

const props = defineProps({
  projectId: {
    type: [String, Number],
    required: true
  }
})

const formData = reactive({
  title: '',
  description: '',
  budget: null,
  status: 'pending',
  dueDate: '',
  projectId: props.projectId,
  priority: 'low'
})

const statusOptions = [
  { label: 'Pending', value: 'pending' },
  { label: 'In Progress', value: 'in progress' },
  { label: 'Completed', value: 'completed' }
]
const priorityOptions = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' }
]
const createTaskMutation = reactive(useMutation({
  mutationFn: createTask
}))
const queryClient = useQueryClient()
function submit () {
  createTaskMutation.mutateAsync(formData)
    .then(() => {
      queryClient.invalidateQueries({ queryKey: ['tasks', { projectId: props.projectId }] })
      onDialogOK()
    })
}

defineEmits([
  ...useDialogPluginComponent.emits
])

const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent()
</script>
