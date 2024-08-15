<template>
  <q-page class="flex justify-center bg-grey-1">
    <q-card class="max-w-[90dvw] sm:max-w-[550px] w-full mt-5 sm:mt-10 p-6 sm:p-7 rounded-md h-fit !shadow" bordered flat>
      <q-form @submit.prevent="submit" class="column gap-1" ref="createProjectForm" @reset="resetForm">
        <div class="column mb-3">
          <h5 class="text-h4">New Project</h5>
        </div>
        <q-banner class="bg-rose-200 rounded-md text-body1 mb-3" inline-actions v-show="createProjectMutation.isError">
          {{ createProjectMutation.error?.message }}
          <template v-slot:action>
            <q-btn flat icon="mdi-close-circle" round dense @click="createProjectMutation.reset" />
          </template>
        </q-banner>
        <q-input v-model="formdata.name" type="text" outlined label="Project Name" required class="text-body1" bottom-slots>
          <template #prepend>
            <q-icon name="mdi-card-text"></q-icon>
          </template>
        </q-input>
        <q-input v-model="formdata.description" type="text" outlined label="Project Description (Optional)" class="text-body1" bottom-slots autogrow>
          <template #prepend>
            <q-icon name="mdi-text-box-outline"></q-icon>
          </template>
        </q-input>
        <div class="grid sm:grid-cols-2 gap-x-4 gap-y-1">
          <q-input outlined v-model="formdata.startDate" type="date" label="Start Date" required bottom-slots>
            <template #prepend>
              <q-icon name="mdi-calendar"></q-icon>
            </template>
            <template #append>
              <DateChooser v-model="formdata.startDate"></DateChooser>
            </template>
          </q-input>
          <q-input outlined v-model="formdata.endDate" type="date" label="End Date" required bottom-slots :rules="[val => new Date(val) >= new Date(formdata.startDate) || 'End date must be on or after the start date']" lazy-rules="ondemand">
            <template #prepend>
              <q-icon name="mdi-calendar"></q-icon>
            </template>
            <template #append>
              <DateChooser v-model="formdata.endDate"></DateChooser>
            </template>
          </q-input>
        </div>
        <q-input outlined v-model="formdata.budget" type="number" label="Budget" required :rules="[val => val > 0 || 'Invalid Budget']" clearable>
          <template #prepend>
            <q-icon name="mdi-cash-multiple"></q-icon>
          </template>
        </q-input>
        <q-btn label="Continue" no-caps class="w-full rounded-md" size="lg" color="primary" type="submit" :loading="createProjectMutation.isPending" :disabled="createProjectMutation.isPending">
          <template #loading>
            <q-spinner-ios></q-spinner-ios><span class="ml-2">Loading...</span>
          </template>
        </q-btn>
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup>
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useQuasar } from 'quasar'
import DateChooser from 'src/components/DateChooser.vue'
import { createProject } from 'src/composables/api'
import { reactive, ref } from 'vue'

const initialState = () => ({
  name: null,
  description: null,
  startDate: null,
  endDate: null,
  budget: null
})
const formdata = reactive(initialState())

const createProjectMutation = reactive(useMutation({
  mutationFn: createProject
}))

const $q = useQuasar()
const createProjectForm = ref(null)
const resetForm = () => { Object.assign(formdata, initialState()) }
const queryClient = useQueryClient()
function submit () {
  createProjectMutation.mutateAsync({
    name: formdata.name,
    description: formdata.description ?? undefined,
    startDate: new Date(`${formdata.startDate}T00:00:00.000Z`).toISOString(),
    endDate: new Date(`${formdata.endDate}T23:59:00.000Z`).toISOString(),
    budget: formdata.budget
  })
    .then((response) => {
      $q.dialog({
        title: 'Success',
        message: 'Project created successfully',
        ok: { label: 'View Project', color: 'primary', to: { name: 'project', params: { id: response.project.id } } },
        cancel: { label: 'Create Another Project', color: 'primary', flat: true }
      })
        .onCancel(() => {
          createProjectForm.value.reset()
        })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    })
}
</script>
