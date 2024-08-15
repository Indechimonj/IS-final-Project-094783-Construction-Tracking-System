<template>
  <q-btn label="Create Issue" icon="add_circle" dense @click="createIssue" class="w-fit mb-2" flat></q-btn>
  <AsyncData :state="issuesQuery" empty-msg="No issues yet!">
    <q-infinite-scroll @load="fetchMoreData">
      <q-list class="column gap-3">
        <div class="card-bordered">
          <template v-for="issue in issuesQuery.data" :key="issue.id">
            <q-item class="rounded-md">
              <q-item-section>
                <q-item-label class="text-subtitle1 font-medium">{{ issue.title }}</q-item-label>
                <q-item-label caption :lines="2">{{ issue.description ?? 'No description yet' }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-separator></q-separator>
          </template>
        </div>
      </q-list>
      <div class="py-4 flex flex-center" v-show="!issuesQuery.hasNextPage">
        <span class="text-caption text-grey-9">No more content</span>
      </div>
    </q-infinite-scroll>
  </AsyncData>
</template>

<script setup>
import { useInfiniteQuery } from '@tanstack/vue-query'
import { viewPaginatedIssuesQueryOptions } from 'src/composables/api'
import { reactive, ref } from 'vue'
import AsyncData from 'src/components/AsyncData.vue'
import { useQuasar } from 'quasar'
import CreateIssueDialog from './CreateIssueDialog.vue'

const props = defineProps({
  projectId: {
    type: [String, Number],
    required: true
  }
})

const projectId = ref(props.projectId)
const issuesQuery = reactive(useInfiniteQuery(viewPaginatedIssuesQueryOptions(projectId)))
function fetchMoreData (_index, done) {
  if (issuesQuery.isFetching) return done()
  else if (!issuesQuery.hasNextPage) return done(true)
  issuesQuery.fetchNextPage().then(done())
}
const $q = useQuasar()
const createIssue = () => {
  $q.dialog({
    component: CreateIssueDialog,
    componentProps: {
      projectId: projectId.value
    }
  })
}
</script>
