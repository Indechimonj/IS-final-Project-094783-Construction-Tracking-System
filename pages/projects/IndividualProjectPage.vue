<template>
  <q-page class="flex justify-center">
    <section class="max-w-[90dvw] sm:max-w-[700px] w-full py-3 sm:p-7 h-full column gap-4 no-wrap">
      <AsyncData :state="projectQuery">
        <div class="column gap-1 [&_>_div]:flex [&_>_div]:flex-row [&_>_div]:justify-between [&_>_div]:items-center">
          <div>
            <q-item-label overline>PROJECT</q-item-label>
            <q-btn flat icon="mdi-dots-vertical" class="text-grey-7" round dense>
              <q-menu class="w-fit" self="top end" anchor="bottom middle">
                <q-list>
                  <q-item clickable v-ripple class="w-max" @click="deleteProjectDialogOpen = true">
                    <q-item-section avatar class="min-w-0">
                      <q-icon name="delete" color="red"></q-icon>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-body1 text-red">Delete Project</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
          <div>
            <h4 class="text-h4 ml-[-3px]">{{ projectQuery.data.name }}</h4>
            <q-btn flat icon="edit" class="text-grey-7" round dense>
              <FieldPopupEdit
                icon="mdi-card-text"
                label="Project Name"
                field="name"
                :originalValue="projectQuery.data.name"
                type="text"
                endpoint="/projects"
                :rowId="projectId"
                :queryKeyToUpdate="[ 'project', { id: projectId } ]"
                :queryKeysToInvalidate="[['projects']]"
              ></FieldPopupEdit>
            </q-btn>
          </div>
          <div>
            <div class="text-body1 text-grey-7">
              {{ projectQuery.data.description ?? 'No description yet' }}
            </div>
            <q-btn flat icon="edit" class="text-grey-7" round dense>
              <FieldPopupEdit
                icon="mdi-text-box-outline"
                label="Project Description"
                field="description"
                :originalValue="projectQuery.data.description"
                type="text"
                endpoint="/projects"
                :rowId="projectId"
                :queryKeyToUpdate="[ 'project', { id: projectId } ]"
                :queryKeysToInvalidate="[['projects']]"
              ></FieldPopupEdit>
            </q-btn>
          </div>
        </div>
        <q-tabs class="w-fit bg-grey-2 rounded-xl" dense narrow-indicator indicator-color="white">
          <q-route-tab v-for="tab in tabs" :key="tab.label" :name="tab.label" :label="tab.label" :to="{ name: tab.name, params: { id: projectId } }" class="gt-sm text-grey-7 rounded-lg m-1" exact-active-class="bg-white !text-black shadow-1"></q-route-tab>
          <!-- Active tab -->
          <q-tab :name="activeTab.name" :label="activeTab.label" class="lt-md text-black"></q-tab>
          <q-btn-dropdown auto-close flat class="lt-md" dropdown-icon="mdi-unfold-more-horizontal">
            <q-list class="w-fit min-w-[150px]">
              <q-item v-for="tab in tabs" :key="tab.label" clickable v-ripple :to="{ name: tab.name, params: { id: projectId } }" exact>
                <q-item-section>
                  <q-item-label>{{ tab.label }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </q-tabs>
        <router-view :projectId="projectId"></router-view>
      </AsyncData>
    </section>
    <q-dialog v-model="deleteProjectDialogOpen" persistent>
      <q-card class="p-2">
        <q-card-section class="row justify-between">
          <h5 class="text-h5">Delete Project</h5>
          <q-btn icon="close" dense flat rounded v-close-popup></q-btn>
        </q-card-section>
        <q-card-section>
          <p class="text-body1">Are you sure you want to delete this project?</p>
          <p class="text-body1">This cannot be reversed!</p>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Cancel" flat v-close-popup></q-btn>
          <q-btn label="Delete" color="negative" @click="onDeleteProject" :loading="deleteProjectMutation.isPending" :disable="deleteProjectMutation.isPending"></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { deleteProject, getProjectByIdQueryOptions } from 'src/composables/api'
import { computed, reactive, ref } from 'vue'
import AsyncData from 'src/components/AsyncData.vue'
import FieldPopupEdit from 'src/components/FieldPopupEdit.vue'
import { useRouter, useRoute } from 'vue-router'

// const projectMenuOpen = ref(false)

const props = defineProps({
  projectId: {
    type: [String, Number],
    required: true
  }
})

const projectId = ref(props.projectId)

const projectQuery = reactive(useQuery(getProjectByIdQueryOptions(projectId)))

const deleteProjectMutation = reactive(useMutation({
  mutationKey: ['deleteProject', { id: projectId }],
  mutationFn: deleteProject
}))
const queryClient = useQueryClient()
const deleteProjectDialogOpen = ref(false)
const router = useRouter()
const onDeleteProject = () => {
  deleteProjectMutation.mutateAsync(projectId.value)
    .then(() => {
      queryClient.invalidateQueries(['project', { id: projectId.value }])
      router.push({ name: 'projects' })
      deleteProjectDialogOpen.value = false
    })
}
const tabs = [
  { label: 'Tasks', name: 'project' },
  { label: 'Resources', name: 'project:resources' },
  { label: 'Issues', name: 'project:issues' },
  { label: 'Documents', name: 'project:documents' },
  { label: 'Reports', name: 'project:reports' }
]
const route = useRoute()
const activeTab = computed(() => tabs.find(tab => tab.name === route.name))
</script>
