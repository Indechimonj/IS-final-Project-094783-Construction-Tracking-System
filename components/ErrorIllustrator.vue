<template>
  <div class="fit column flex-center q-gutter-md q-pa-sm">
    <q-img :src="illustrationSrc" width="240px" class="q-mb-md"></q-img>
    <div class="column q-gutter-md flex-center text-center">
      <div class="text-h5">{{ heading }}</div>
      <div class="text-body1 text-grey-8">{{ subheading }}</div>
      <slot name="button">
        <q-btn :to="buttonTo" color="primary" unelevated :label="buttonLabel" v-if="showButton" />
      </slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  illustrationSrc: {
    type: String,
    default: '/illustrations/undraw_page_not_found_re_e9o6.svg'
  },
  heading: {
    type: String
  },
  subheading: {
    type: String
  },
  buttonTo: {
    type: [Object, String],
    default: '/'
  },
  buttonLabel: {
    type: String,
    default: 'Go Home'
  },
  showButton: {
    type: Boolean,
    default: true
  }
})
</script>
