<template>
  <q-page class="flex justify-center">
    <section class="max-w-[90dvw] sm:max-w-[750px] w-full py-3 sm:px-7 sm:py-5">
      <AsyncData :state="taskQuery">
        <template v-slot="{ data: task }">
          <q-btn icon="mdi-chevron-left" :to="{ name: 'project', params: { id: task.projectId } }" label="Parent project" dense flat color="primary" class="ml-[-18px]"></q-btn>
          <section class="mt-1 column gap-y-1">
            <div class="row justify-between">
              <div class=" text-overline text-primary">TASK</div>
              <q-btn flat icon="mdi-dots-vertical" class="text-grey-7" round dense>
              <q-menu class="w-fit" self="top end" anchor="bottom middle">
                <q-list>
                  <q-item clickable v-ripple class="w-max" @click="deleteTaskDialogOpen = true">
                    <q-item-section avatar class="min-w-0">
                      <q-icon name="delete" color="red"></q-icon>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-body1 text-red">Delete Task</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
            </div>
            <div class="row justify-between">
              <h5 class="text-h5">{{ task.title }}</h5>
              <q-btn dense icon="edit" round flat color="grey-7" v-if="task.canEditTask">
                <FieldPopupEdit
                  icon="mdi-tag-outline"
                  label="Task Title"
                  field="title"
                  :originalValue="task.title"
                  type="text"
                  endpoint="/tasks"
                  :rowId="task.id"
                  :queryKeyToUpdate="['task', { id }]"
                  :queryKeysToInvalidate="[['tasks']]"
                ></FieldPopupEdit>
              </q-btn>
            </div>
            <div class="row justify-between">
              <div class="text-grey-8">{{ task.description ?? 'No description yet' }}</div>
              <q-btn dense icon="edit" round flat color="grey-7" v-if="task.canEditTask">
                <FieldPopupEdit
                  icon="mdi-text"
                  label="Task Description"
                  field="description"
                  :originalValue="task.description"
                  type="text"
                  endpoint="/tasks"
                  :rowId="task.id"
                  :queryKeyToUpdate="['task', { id }]"
                  :queryKeysToInvalidate="[['tasks']]"
                ></FieldPopupEdit>
              </q-btn>
            </div>
            <div class="card-bordered my-2 py-4 px-5">
              <h6 class="text-h6 mb-2">Task Details</h6>
              <div class="grid sm:grid-cols-2 w-full gap-4 items-center">
                <div>
                  <q-item-label class="font-medium text-primary">Created By</q-item-label>
                  <q-item class="pl-0">
                    <q-item-section avatar top>
                      <q-avatar color="blue-grey-2">
                        {{ task.createdByUser.firstName[0] }}{{ task.createdByUser.lastName[0] }}
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ task.createdByUser.firstName }} {{ task.createdByUser.lastName }}</q-item-label>
                      <q-item-label class="caption">{{ formatDate(new Date(task.dueDate), 'ddd, Do MMM YYYY') }} ({{ formatTimeAgo(new Date(task.createdAt)) }})</q-item-label>
                    </q-item-section>
                  </q-item>
                </div>
                <q-chip square size="18px" class="capitalize w-fit" :icon-right="task.canEditTask ? 'mdi-chevron-down' : void 0" clickable>
                  <q-avatar icon="mdi-progress-wrench" color="primary" text-color="white" />
                  {{ task.status }}
                  <FieldPopupSelectEdit
                    icon="mdi-progress-check"
                    label="Task Status"
                    field="status"
                    :originalValue="task.status"
                    :options="statusOptions"
                    endpoint="/tasks"
                    :rowId="task.id"
                    :queryKeyToUpdate="['task', { id }]"
                    :queryKeysToInvalidate="[['tasks']]"
                     v-if="task.canEditTask"
                  ></FieldPopupSelectEdit>
                </q-chip>
              </div>
              <div class="grid sm:grid-cols-2 w-full gap-4">
                <div>
                  <q-item-label class="mt-2 font-medium text-primary">Budget</q-item-label>
                  <q-item class="pl-0">
                    <q-item-section>
                      <q-item-label>
                        {{ task.budget > 0 ? formatCurrency(task.budget) : 'No budget set' }}
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side v-if="task.canEditTask">
                      <q-btn dense icon="edit" round flat color="grey-7">
                        <FieldPopupEdit
                          icon="mdi-cash-multiple"
                          label="Task Budget"
                          field="budget"
                          :originalValue="task.budget"
                          type="number"
                          endpoint="/tasks"
                          :rowId="task.id"
                          :queryKeyToUpdate="['task', { id }]"
                          :queryKeysToInvalidate="[['tasks']]"
                        ></FieldPopupEdit>
                      </q-btn>
                    </q-item-section>
                  </q-item>
                </div>
                <div>
                  <q-item-label class="mt-2 font-medium text-primary">Assigned to Employee</q-item-label>
                  <q-item class="px-0">
                    <q-item-section avatar>
                      <q-avatar icon="more" color="blue-grey-2" v-if="task.assignedToUserId">
                        {{ task.assignedToUser.firstName[0] }}{{ task.assignedToUser.lastName[0] }}
                      </q-avatar>
                      <q-avatar icon="mdi-account-question-outline" color="blue-grey-2" v-else></q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label v-if="task.assignedToUser">
                        {{ task.assignedToUser.firstName }} {{ task.assignedToUser.lastName }}
                      </q-item-label>
                      <q-item-label v-else>No employee assigned</q-item-label>
                    </q-item-section>
                  </q-item>
                </div>
              </div>
            </div>
            <div class="card-bordered my-2 py-4 px-5">
              <h6 class="text-h6 mb-2">Task Dates</h6>
              <div class="grid sm:grid-cols-2 w-full gap-4">
                <div>
                  <q-item-label class="font-medium text-primary">Start Date</q-item-label>
                  <q-item class="pl-0">
                    <q-item-section>
                      <q-item-label>
                        {{ task.startDate ? formatDate(new Date(task.startDate), 'ddd, Do MMM YYYY') : 'No start date' }}
                      </q-item-label>
                      <q-item-label caption class="capitalize">
                        {{ task.startDate ? formatTimeAgo(new Date(task.startDate)) : '' }}
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side v-if="task.canEditTask">
                      <q-btn dense icon="edit" round flat color="grey-7">
                        <FieldPopupDateEdit
                          label="Task Start Date"
                          field="startDate"
                          :originalValue="formatDate(new Date(task.startDate), 'YYYY-MM-DD')"
                          endpoint="/tasks"
                          :rowId="task.id"
                          :queryKeyToUpdate="['task', { id }]"
                          :queryKeysToInvalidate="[['tasks']]"
                        ></FieldPopupDateEdit>
                      </q-btn>
                    </q-item-section>
                  </q-item>
                </div>
                <div>
                  <q-item-label class="font-medium text-primary">Due Date</q-item-label>
                  <q-item class="pl-0">
                    <q-item-section>
                      <q-item-label>
                        {{ task.dueDate ? formatDate(new Date(task.dueDate), 'ddd, Do MMM YYYY') : 'No start date' }}
                      </q-item-label>
                      <q-item-label caption class="capitalize">
                        {{ task.dueDate ? formatTimeAgo(new Date(task.dueDate)) : '' }}
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side v-if="task.canEditTask">
                      <q-btn dense icon="edit" round flat color="grey-7">
                        <FieldPopupDateEdit
                          label="Task Due Date"
                          field="dueDate"
                          :originalValue="formatDate(new Date(task.dueDate), 'YYYY-MM-DD')"
                          endpoint="/tasks"
                          :rowId="task.id"
                          :queryKeyToUpdate="['task', { id }]"
                          :queryKeysToInvalidate="[['tasks']]"
                          required
                        ></FieldPopupDateEdit>
                      </q-btn>
                    </q-item-section>
                  </q-item>
                </div>
              </div>
            </div>
            <div class="card-bordered pb-5 pt-4 px-5">
              <h6 class="text-h6 mb-1">Allocated Resources</h6>
              <q-btn label="Allocate New Resource" icon="add_circle" dense @click="createTaskAllocationDialogOpen = true" class="w-fit mb-2" flat></q-btn>
              <AsyncData :state="resourceAllocationsQuery" empty-msg="No resources allocated yet!">
                <template #default="{ data: resourceAllocations }">
                  <q-infinite-scroll @load="fetchMoreData">
                    <q-list>
                      <template v-for="allocation in resourceAllocations" :key="allocation.id">
                        <q-item class="p-0">
                          <q-item-section>
                            <div class="row justify-between items-center">
                              <q-item-label class="font-medium">{{ allocation.resource.name }}</q-item-label>
                              <div class="row flex-center gap-1">
                                <q-item-label class="font-medium">{{ formatCurrency(allocation.quantity * allocation.costValue) }}</q-item-label>
                                <q-btn dense icon="mdi-dots-vertical" round flat color="grey-7">
                                  <q-menu self="top right" anchor="bottom middle">
                                    <q-list>
                                      <q-item clickable v-ripple @click="() => editResourceAllocation(allocation.id)">
                                        <q-item-section avatar class="min-w-0">
                                          <q-icon name="mdi-pencil" class="caption"></q-icon>
                                        </q-item-section>
                                        <q-item-section>
                                          <q-item-label>Edit</q-item-label>
                                        </q-item-section>
                                      </q-item>
                                      <q-separator></q-separator>
                                      <q-item clickable v-ripple class="text-red" @click="() => onDeleteResourceAllocation(allocation.id)">
                                        <q-item-section avatar class="min-w-0">
                                          <q-icon name="mdi-delete"></q-icon>
                                        </q-item-section>
                                        <q-item-section>
                                          <q-item-label>Delete</q-item-label>
                                        </q-item-section>
                                      </q-item>
                                    </q-list>
                                  </q-menu>
                                </q-btn>
                              </div>
                            </div>
                            <q-item-label class="text-body2">{{ allocation.quantity }} · {{ allocation.resource.units }} · @ {{ formatCurrency(allocation.costValue) }}</q-item-label>
                            <div class="row gap-1">
                              <q-chip class="capitalize w-fit ml-0 my-2 bg-red-2" dense square>{{ allocation.resource.type }}</q-chip>
                              <q-chip class="capitalize w-fit ml-0 my-2 bg-blue-grey-2" dense square>{{ allocation.costType }} Payment</q-chip>
                            </div>
                            <q-item-label class="caption">{{ allocation.resource.description }}</q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-separator spaced></q-separator>
                      </template>
                    </q-list>
                    <small class="flex flex-center caption">
                      No more content
                    </small>
                  </q-infinite-scroll>
                </template>
              </AsyncData>
            </div>
          </section>
          <!-- Create Task Allocation Dialog -->
          <q-dialog v-model="createTaskAllocationDialogOpen" persistent>
            <q-card class="w-fit">
              <q-card-section>
                <div class="w-full row">
                  <q-btn icon="arrow_back" flat dense rounded v-close-popup></q-btn>
                  <h5 class="text-h5 mx-auto">Create New Resource Allocation</h5>
                </div>
                <ErrorBanner :mutation="createResourceAllocationMutation" class="mt-3"></ErrorBanner>
              </q-card-section>
              <q-form @submit.stop="onCreateResourceAllocation">
                <q-separator></q-separator>
                <div class="px-5 py-1">
                  <q-select
                    v-model="taskAllocationFormdata.resourceId"
                    label="Resource"
                    label-color="primary"
                    placeholder="Search for a resource"
                    stack-label
                    borderless
                    clearable
                    :loading="resourcesSelectionQuery.isLoading"
                    :options="resourcesSelectionQuery.data"
                    map-options
                    option-label="name"
                    option-value="id"
                    emit-value
                    use-chips
                    :use-input="!taskAllocationFormdata.resourceId"
                    @filter="filterFunction"
                    required
                  >
                    <template #prepend>
                      <q-icon name="mdi-tag-text-outline"></q-icon>
                    </template>
                    <template #no-option>
                      <q-item>
                        <q-item-section class="text-grey-8">
                          <q-item-label v-show="resourcesSelectionQuery.isError">{{ resourcesSelectionQuery.error?.message }}</q-item-label>
                          <div class="row justify-between items-center" v-show="!resourcesSelectionQuery.isError">
                            <q-item-label>No matching resources found</q-item-label>
                            <q-btn dense label="Add resource" flat class="w-fit" color="primary" @click="createResource" icon="add" no-caps></q-btn>
                          </div>
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>
                <q-separator></q-separator>
                <div class="px-5 py-1">
                  <q-input
                    v-model="taskAllocationFormdata.quantity"
                    label="Quantity"
                    label-color="primary"
                    type="number"
                    stack-label
                    borderless
                    required
                    placeholder="Enter quantity"
                    :rules="[val => val > 0 || 'Quantity must be greater than 0']"
                    hide-bottom-space
                  >
                  <template #prepend>
                    <q-icon name="mdi-numeric-2-box-multiple-outline"></q-icon>
                  </template>
                  <template #append>
                    <q-chip class="text-body2 self-end">{{ taskAllocationFormdata.resourceId ? resourcesSelectionQuery.data?.find((val) => val.id === taskAllocationFormdata.resourceId).units : '' }}</q-chip>
                  </template>
                  </q-input>
                </div>
                <q-separator></q-separator>
                <div class="px-5 py-1 grid grid-cols-[1fr,_auto,_1fr] gap-2 justify-between">
                  <q-select v-model="taskAllocationFormdata.costType" :options="costTypeOptions" label="Cost Type" stack-label label-color="primary" borderless popup-content-class="capitalize" class="capitalize" required>
                    <template #prepend>
                      <q-icon name="mdi-clipboard-text-clock-outline"></q-icon>
                    </template>
                  </q-select>
                  <q-separator vertical spaced></q-separator>
                  <q-input v-model="taskAllocationFormdata.costValue" label="Cost (Ksh.)" label-color="primary" stack-label type="number" borderless required placeholder="Enter Cost" :rules="[val => val > 0 || 'Cost must be greater than 0']" hide-bottom-space>
                    <template #prepend>
                      <q-icon name="mdi-cash-multiple"></q-icon>
                    </template>
                  </q-input>
                </div>
                <q-separator></q-separator>
                <q-card-section class="flex">
                  <q-btn
                    label="Allocate Resource"
                    color="primary"
                    type="submit"
                    class="w-fit rounded-md ml-auto"
                    :loading="createResourceAllocationMutation.isPending"
                    :disable="createResourceAllocationMutation.isPending"
                  >
                    <template #loading>
                      <q-spinner-ios></q-spinner-ios><span class="ml-2">Creating...</span>
                    </template>
                  </q-btn>
                </q-card-section>
              </q-form>
            </q-card>
          </q-dialog>
          <!-- Delete Task Dialog -->
          <q-dialog v-model="deleteTaskDialogOpen" persistent>
            <q-card class="p-2">
              <q-card-section class="row justify-between">
                <h5 class="text-h5">Delete Task</h5>
                <q-btn icon="close" dense flat rounded v-close-popup></q-btn>
              </q-card-section>
              <q-card-section>
                <p class="text-body1">Are you sure you want to delete this task?</p>
                <p class="text-body1">This cannot be reversed!</p>
              </q-card-section>
              <q-card-actions align="right">
                <q-btn label="Cancel" flat v-close-popup></q-btn>
                <q-btn label="Delete" color="negative" @click="onDeleteTask" :loading="deleteTaskMutation.isPending" :disable="deleteTaskMutation.isPending"></q-btn>
              </q-card-actions>
            </q-card>
          </q-dialog>
        </template>
      </AsyncData>
    </section>
  </q-page>
</template>

<script setup>
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import AsyncData from 'src/components/AsyncData.vue'
import { createResourceAllocation, deleteResourceAllocation, deleteTask, getTaskByIdQueryOption, viewFilteredResourcesQueryOptions, viewPaginatedResourceAllocationsQueryOptions } from 'src/composables/api'
import { reactive, ref } from 'vue'
import { onBeforeRouteUpdate, useRouter } from 'vue-router'
import { date, useQuasar } from 'quasar'
import { formatTimeAgo } from '@vueuse/core'
import { formatCurrency } from 'src/composables/formatter'
import FieldPopupEdit from 'src/components/FieldPopupEdit.vue'
import FieldPopupSelectEdit from 'src/components/FieldPopupSelectEdit.vue'
import FieldPopupDateEdit from 'src/components/FieldPopupDateEdit.vue'
import ErrorBanner from 'src/components/ErrorBanner.vue'
import CreateResourceDialog from 'src/components/CreateResourceDialog.vue'
import EditResourceAllocationDialog from 'src/components/EditResourceAllocationDialog.vue'

const { formatDate } = date

const props = defineProps({
  id: { type: [String, Number], required: true }
})
const id = ref(props.id)
onBeforeRouteUpdate((to) => {
  id.value = to.params.id
})
const taskQuery = reactive(useQuery(getTaskByIdQueryOption(id)))
const statusOptions = [
  { label: 'Pending', value: 'pending' },
  { label: 'In Progress', value: 'in progress' },
  { label: 'Completed', value: 'completed' }
]
const resourceAllocationsQuery = reactive(useInfiniteQuery(viewPaginatedResourceAllocationsQueryOptions(id, 10)))
const fetchMoreData = (_index, done) => {
  if (resourceAllocationsQuery.isFetching) return done()
  else if (!resourceAllocationsQuery.hasNextPage) return done(true)
  resourceAllocationsQuery.fetchNextPage().then(done())
}
const createTaskAllocationDialogOpen = ref(false)
const taskAllocationFormInitialState = {
  resourceId: null,
  quantity: null,
  costValue: null,
  costType: 'one time'
}
const taskAllocationFormdata = reactive({ ...taskAllocationFormInitialState })
const filterResourceName = ref('')
const resourcesSelectionQuery = reactive(useInfiniteQuery(viewFilteredResourcesQueryOptions(taskQuery, filterResourceName)))
const filterFunction = (inputValue, doneFn, abortFn) => {
  filterResourceName.value = inputValue
  resourcesSelectionQuery.refetch({ throwOnError: true, cancelRefetch: false })
    .then(() => doneFn())
    .catch(() => abortFn())
}
const costTypeOptions = ['per hour', 'per day', 'one time']
const createResourceAllocationMutation = reactive(useMutation({
  mutationKey: ['createResourceAllocation'],
  mutationFn: createResourceAllocation
}))
const queryClient = useQueryClient()
const onCreateResourceAllocation = () => {
  createResourceAllocationMutation.mutateAsync({
    formdata: taskAllocationFormdata,
    taskId: id.value
  }).then(() => {
    queryClient.invalidateQueries({ queryKey: ['resourceAllocations', { taskId: id.value }] })
    Object.assign(taskAllocationFormdata, taskAllocationFormInitialState)
    createTaskAllocationDialogOpen.value = false
  })
}
const $q = useQuasar()
const createResource = () => {
  $q.dialog({
    component: CreateResourceDialog,
    componentProps: {
      projectId: taskQuery.data?.projectId
    }
  })
}
const deleteTaskMutation = reactive(useMutation({
  mutationKey: ['deleteTask', { id: id.value }],
  mutationFn: deleteTask
}))
const deleteTaskDialogOpen = ref(false)
const router = useRouter()
const onDeleteTask = () => {
  deleteTaskMutation.mutateAsync(id.value)
    .then(() => {
      const projectId = taskQuery.data?.projectId
      queryClient.invalidateQueries(['task', { id: id.value }])
      router.push(projectId ? { name: 'project', params: { id: projectId } } : { name: 'projects' })
      deleteTaskDialogOpen.value = false
    })
}
const editResourceAllocation = (resourceAllocationId) => {
  $q.dialog({
    component: EditResourceAllocationDialog,
    componentProps: {
      resourceAllocationId
    }
  })
}
const deleteResourceAllocationMutation = reactive(useMutation({
  mutationFn: deleteResourceAllocation
}))
function onDeleteResourceAllocation (resourceAllocationId) {
  $q.dialog({
    title: 'Delete Resource Allocation',
    message: 'Are you sure you want to delete this resource allocation?',
    persistent: true,
    ok: 'Yes',
    cancel: 'No'
  }).onOk(() => {
    deleteResourceAllocationMutation.mutateAsync(resourceAllocationId)
      .then(() => {
        queryClient.invalidateQueries(['resourceAllocation', { id: resourceAllocationId }])
        queryClient.invalidateQueries(['resourceAllocations'])
      })
  })
}
</script>
