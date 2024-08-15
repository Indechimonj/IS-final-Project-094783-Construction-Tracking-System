<template>
  <q-page class="flex justify-center">
    <section class="max-w-[90dvw] sm:max-w-[700px] w-full p-6 sm:p-7 grid grid-rows-[auto,_1fr]">
      <div class="row justify-between">
        <h4 class="text-h4">My Projects</h4>
        <q-btn icon="add" label="New Project" color="primary" class="rounded-md" :to="{ name: 'projects:new' }"></q-btn>
      </div>
      <div class="mt-3">
        <AsyncData :state="projectsInfiniteQuery" empty-msg="No projects yet!">
          <q-infinite-scroll @load="fetchMoreData">
            <q-list class="column gap-3">
              <q-card flat bordered v-for="project in projectsInfiniteQuery.data" :key="project.id" class="rounded-md">
                <q-item :to="{ name: 'project', params: { id: project.id } }" clickable v-ripple>
                  <q-item-section avatar>
                    <q-avatar icon="mdi-hard-hat" size="lg" class="bg-grey-2"></q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-subtitle1 font-medium">{{ project.name }}</q-item-label>
                    <q-item-label caption :lines="2">{{ project.description ?? 'No description yet' }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-btn icon="chevron_right" flat dense rounded>
                    </q-btn>
                  </q-item-section>
                </q-item>
              </q-card>
            </q-list>
            <div class="py-4 flex flex-center" v-show="!projectsInfiniteQuery.hasNextPage">
              <span class="text-caption text-grey-9">No more content</span>
            </div>
            <template #loading>
              <div class="flex flex-center fit">
                <q-spinner-ios size="lg"></q-spinner-ios>
              </div>
            </template>
          </q-infinite-scroll>
        </AsyncData>
      </div>
    </section>
  </q-page>
</template>

<script setup>
import { useInfiniteQuery } from '@tanstack/vue-query'
import { viewPaginatedProjectsQueryOptions } from 'src/composables/api'
import { reactive } from 'vue'
import AsyncData from 'src/components/AsyncData.vue'

const projectsInfiniteQuery = reactive(useInfiniteQuery(viewPaginatedProjectsQueryOptions(10)))
const fetchMoreData = (_index, done) => {
  if (projectsInfiniteQuery.isFetching) return done()
  else if (!projectsInfiniteQuery.hasNextPage) return done(true)
  projectsInfiniteQuery.fetchNextPage().then(done())
}
</script>
