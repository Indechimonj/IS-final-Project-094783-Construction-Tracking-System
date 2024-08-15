<template>
   <q-btn label="Create Resource" icon="add_circle" dense @click="createResource" class="w-fit mb-2" flat></q-btn>
  <AsyncData :state="resourcesQuery" emptyMsg="No resources yet!">
    <q-infinite-scroll @load="fetchMoreData">
      <q-list class="column gap-3">
        <div class="card-bordered">
          <template v-for="resource in resourcesQuery.data" :key="resource.id">
            <q-item class="rounded-md">
              <q-item-section>
                <q-item-label class="text-subtitle1 font-medium">{{ resource.name }}</q-item-label>
                <q-item-label caption :lines="2">{{ resource.description ?? 'No description yet' }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-separator></q-separator>
          </template>
        </div>
      </q-list>
      <div class="py-4 flex flex-center" v-show="!resourcesQuery.hasNextPage">
        <span class="text-caption text-grey-9">No more content</span>
      </div>
      <template #loading>
        <div class="flex flex-center fit">
          <q-spinner-ios size="lg"></q-spinner-ios>
        </div>
      </template>
    </q-infinite-scroll>
  </AsyncData>
</template>

<script setup>
import { useInfiniteQuery } from '@tanstack/vue-query'
import { viewPaginatedResourcesQueryOptions } from 'src/composables/api'
import { reactive, ref } from 'vue'
import AsyncData from 'src/components/AsyncData.vue'
import { useQuasar } from 'quasar'
import CreateResourceDialog from './CreateResourceDialog.vue'

const props = defineProps({
  projectId: {
    type: [String, Number],
    required: true
  }
})

const projectId = ref(props.projectId)
const resourcesQuery = reactive(useInfiniteQuery(viewPaginatedResourcesQueryOptions(projectId)))
function fetchMoreData (_index, done) {
  if (resourcesQuery.isFetching) return done()
  else if (!resourcesQuery.hasNextPage) return done(true)
  resourcesQuery.fetchNextPage().then(done())
}
const $q = useQuasar()
const createResource = () => {
  $q.dialog({
    component: CreateResourceDialog,
    componentProps: {
      projectId: projectId.value
    }
  })
}
</script>
