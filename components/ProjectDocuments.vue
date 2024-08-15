<template>
  <q-btn label="Create Document" icon="add_circle" dense @click="createDocument" class="w-fit mb-2" flat></q-btn>
  <AsyncData :state="documentsQuery" empty-msg="No documents yet!">
    <q-infinite-scroll @load="fetchMoreData">
      <q-list class="column gap-3">
        <div class="card-bordered">
          <template v-for="document in documentsQuery.data" :key="document.id">
            <q-item class="rounded-md">
              <q-item-section>
                <q-item-label class="text-subtitle1 font-medium">{{ document.name }}</q-item-label>
                <q-item-label caption :lines="2">{{ document.description ?? 'No description yet' }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn dense flat icon="mdi-download" :download="document.name" :href="`http://localhost:3333/documents/${document.id}/download`" target="_blank"></q-btn>
              </q-item-section>
            </q-item>
            <q-separator></q-separator>
          </template>
        </div>
      </q-list>
      <div class="py-4 flex flex-center" v-show="!documentsQuery.hasNextPage">
        <span class="text-caption text-grey-9">No more content</span>
      </div>
    </q-infinite-scroll>
  </AsyncData>
</template>

<script setup>
import { useInfiniteQuery } from '@tanstack/vue-query'
import { viewPaginatedDocumentsQueryOptions } from 'src/composables/api'
import { reactive, ref } from 'vue'
import AsyncData from 'src/components/AsyncData.vue'
import { useQuasar } from 'quasar'
import CreateDocumentDialog from './CreateDocumentDialog.vue'

const props = defineProps({
  projectId: {
    type: [String, Number],
    required: true
  }
})

const projectId = ref(props.projectId)
const documentsQuery = reactive(useInfiniteQuery(viewPaginatedDocumentsQueryOptions(projectId)))
function fetchMoreData (_index, done) {
  if (documentsQuery.isFetching) return done()
  else if (!documentsQuery.hasNextPage) return done(true)
  documentsQuery.fetchNextPage().then(done())
}
const $q = useQuasar()
const createDocument = () => {
  $q.dialog({
    component: CreateDocumentDialog,
    componentProps: {
      projectId: projectId.value
    }
  })
}
</script>
