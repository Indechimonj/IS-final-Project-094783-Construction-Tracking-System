<template>
  <q-layout view="hHh Lpr lFr" class="text-body1">
    <q-header bordered class="bg-white text-black/80">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title :shrink="false">
          <RouterLink to="/">DE-CONSTRUCT</RouterLink>
        </q-toolbar-title>
        <q-item dense class="mr-1 p-0 sm:px-2 sm:py-1 rounded-full sm:rounded-md" clickable v-ripple @click="signedInOptionsMenuOpen = true" id="toolbar-account">
          <AsyncData :state="meQuery">
            <q-item-section avatar class="min-w-fit p-0 sm:pr-3">
              <q-avatar color="blue-grey-2">
                {{ meQuery.data.firstName[0] }}{{ meQuery.data.lastName[0] }}
              </q-avatar>
            </q-item-section>
            <q-item-section class="gt-xs">
              <q-item-label :lines="1">
                {{ meQuery.data.firstName }} {{ meQuery.data.lastName }}
              </q-item-label>
            </q-item-section>
            <q-menu target="#toolbar-account" fit>
              <q-list>
                <q-item clickable v-ripple :disable="logoutMutation.isPending" @click="onLogout" v-close-popup>
                  <q-item-section avatar>
                    <q-avatar icon="logout"></q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Logout</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
            <template #empty>
              <q-item-section avatar class="min-w-fit pr-3">
                <q-avatar icon="mdi-account" color="grey-4"></q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  Guest
                </q-item-label>
              </q-item-section>
            </template>
            <template #error>
              <q-item-section avatar class="min-w-fit pr-3">
                <q-avatar icon="mdi-account" color="grey-4"></q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  Guest
                </q-item-label>
              </q-item-section>
            </template>
          </AsyncData>
        </q-item>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      :breakpoint="10000"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Essential Links
        </q-item-label>
      </q-list>
    </q-drawer>

    <q-page-container class="h-screen grid grid-cols-[1fr]">
      <router-view />
    </q-page-container>
    <VueQueryDevtools></VueQueryDevtools>
  </q-layout>
</template>

<script setup>
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import AsyncData from 'src/components/AsyncData.vue'
import { getCurrentUserOptions, logout } from 'src/composables/api'
import { provide, reactive, ref } from 'vue'
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'

defineOptions({
  name: 'MainLayout'
})

const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
const meQuery = reactive(useQuery(getCurrentUserOptions))
provide('meQuery', meQuery)
const signedInOptionsMenuOpen = ref(false)

const logoutMutation = reactive(useMutation({
  mutationKey: ['logout'],
  mutationFn: logout
}))
const queryClient = useQueryClient()
const onLogout = () => {
  logoutMutation.mutateAsync()
    .then(() => {
      queryClient.invalidateQueries()
    })
  signedInOptionsMenuOpen.value = false
}
</script>
