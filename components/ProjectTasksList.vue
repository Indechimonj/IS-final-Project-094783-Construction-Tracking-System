<template>
  <q-btn label="Create Task" icon="add_circle" dense @click="createTask" class="w-fit mb-2" flat></q-btn>
  <AsyncData :state="tasksQuery" empty-msg="No tasks yet">
    <q-infinite-scroll @load="fetchMoreData">
      <q-list class="column gap-3">
        <div class="card-bordered">
          <template v-for="task in tasksQuery.data" :key="task.id">
            <q-item class="rounded-md" clickable v-ripple :to="{ name: 'tasks', params: { id: task.id } }">
              <q-item-section>
                <q-item-label class="text-subtitle1 font-medium">{{ task.title }}</q-item-label>
                <q-item-label caption :lines="2">{{ task.description ?? 'No description yet' }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-chip class="text-capitalize">{{ task.status }}</q-chip>
                <q-item-label caption>Due {{ date.formatDate(task.dueDate, 'D MMM YY h:mm A') }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-separator></q-separator>
          </template>
        </div>
      </q-list>
      <div class="py-4 flex flex-center" v-show="!tasksQuery.hasNextPage">
        <span class="text-caption text-grey-9">No more content</span>
      </div>
    </q-infinite-scroll>
  </AsyncData>
</template>

<script setup>
import { useInfiniteQuery } from '@tanstack/vue-query'
import { viewPaginatedTasksQueryOptions } from 'src/composables/api'
import { reactive, ref } from 'vue'
import AsyncData from 'src/components/AsyncData.vue'
import { date, useQuasar } from 'quasar'
import CreateTaskDialog from './CreateTaskDialog.vue'

const props = defineProps({
  projectId: {
    type: [String, Number],
    required: true
  }
})

const projectId = ref(props.projectId)
const tasksQuery = reactive(useInfiniteQuery(viewPaginatedTasksQueryOptions(projectId)))
function fetchMoreData (_index, done) {
  if (tasksQuery.isFetching) return done()
  else if (!tasksQuery.hasNextPage) return done(true)
  tasksQuery.fetchNextPage().then(done())
}
const $q = useQuasar()
const createTask = () => {
  $q.dialog({
    component: CreateTaskDialog,
    componentProps: {
      projectId: projectId.value
    }
  })
}
</script>
