<template>
  <template v-if="state.isLoading">
    <slot name="loading">
      <div class="fit flex flex-center">
        <q-spinner-ios size="lg"></q-spinner-ios>
      </div>
    </slot>
  </template>
  <template v-else-if="state.isError">
    <slot name="error">
      <div class="column flex-center gap-3 text-center h-full">
        <div class="bg-slate-100 mb-5 w-[200px] h-[200px] rounded-full flex flex-center">
          <img :src="errorAvatar" alt="Error" class="w-[150px] h-[150px]">
        </div>
        <div class="text-h5 font-medium">{{ state.error?.title }}</div>
        <div class="text-body1 text-grey-8">{{ state.error?.message }}</div>
      </div>
    </slot>
  </template>
  <template v-else-if="isEmpty">
    <slot name="empty">
      <div class="column flex-center gap-3 text-center h-full">
        <q-avatar color="grey-1" size="180px" class="mb-3" v-show="!dense">
          <img src="/illustrations/undraw_empty_re_opql.svg" alt="Empty" class="p-5">
        </q-avatar>
        <div class="text-h6 font-normal">{{ emptyMsg }}</div>
      </div>
    </slot>
  </template>
  <template v-else>
    <slot :data="state.data"></slot>
  </template>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  state: {
    isLoading: Boolean,
    isError: Boolean,
    error: Error,
    data: Object
  },
  emptyMsg: {
    type: String,
    default: 'No items yet!'
  },
  dense: {
    type: Boolean,
    default: false
  }
})
const errorAvatar = computed(() => {
  switch (props.state.error?.response?.status) {
    case 403:
      return '/illustrations/undraw_access_denied_re_awnf.svg'
    case 404:
      return '/illustrations/undraw_location_search_re_ttoj.svg'
    case 500:
      return '/illustrations/undraw_warning_re_eoyh.svg'
    default:
      return '/illustrations/undraw_server_down_s-4-lk.svg'
  }
})
const isEmpty = computed(() => {
  if ([null, undefined].includes(props.state.data)) return true
  else if (Array.isArray(props.state.data) && props.state.data.length === 0) return true
  else return false
})
</script>
