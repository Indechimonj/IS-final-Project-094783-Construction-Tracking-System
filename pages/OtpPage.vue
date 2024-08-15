<template>
  <q-page class="grid sm:grid-cols-[40%,_1fr]">
    <q-img src="photos/silvia-brazzoduro-YSxcf6C_SEg-unsplash.webp"></q-img>
    <div class="fit flex flex-center">
      <q-form @submit.prevent="submit" class="column gap-4 sm:max-w-[400px] w-full h-fit mt-5 sm:mt-10 p-6 sm:p-7">
        <div class="column gap-2">
          <q-btn label="Go Back" icon="mdi-arrow-left" class="w-fit" flat color="primary" dense outline :to="{ name: 'login' }" no-caps></q-btn>
          <h5 class="text-h4">Verify code</h5>
          <div class="text-subtitle1 text-grey-8 break-all">Verify it's you. Enter the code sent to "{{ email }}"</div>
        </div>
        <q-banner class="bg-rose-200 rounded-md text-body1" inline-actions v-show="verifyOtpMutation.isError || resendOtpMutation.isError">
          {{ verifyOtpMutation.error?.message ?? resendOtpMutation.error?.message }}
          <template #action>
            <q-btn flat icon="mdi-close-circle" round dense @click="verifyOtpMutation.reset" />
          </template>
        </q-banner>
        <q-input v-model="otp" type="number" outlined label="Code" required class="text-body1" autocomplete="one-time-code">
          <template #prepend>
            <q-icon name="mdi-key"></q-icon>
          </template>
        </q-input>
        <q-btn icon="mdi-repeat-variant" :label="resendBtnLabel" flat color="secondary" class="rounded-md w-fit self-center" @click="resendOtp" :disabled="resendOtpMutation.isPending || isCountingDown" :loading="resendOtpMutation.isPending" no-caps>
          <template #loading>
            <q-spinner-ios></q-spinner-ios>
            <span class="ml-2">Resending...</span>
          </template>
        </q-btn>
        <q-btn label="Continue" no-caps class="w-full rounded-md" size="lg" color="primary" type="submit" :loading="verifyOtpMutation.isPending" :disabled="verifyOtpMutation.isPending">
          <template #loading>
            <q-spinner-ios></q-spinner-ios>
            <span class="ml-2">Loading...</span>
          </template>
        </q-btn>
      </q-form>
    </div>
  </q-page>
</template>

<script setup>
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { sendOtp, verifyOtp } from 'src/composables/api'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps({
  email: { type: String },
  continueTo: { type: String }
})
if (!props.email) {
  router.push({ name: 'login', query: { continueTo: props.continueTo } })
}

const otp = ref(null)

const verifyOtpMutation = reactive(useMutation({
  mutationKey: ['verifyOtp'],
  mutationFn: verifyOtp
}))

const resendOtpMutation = reactive(useMutation({
  mutationKey: ['sendOtp'],
  mutationFn: sendOtp
}))
const queryClient = useQueryClient()

function submit () {
  verifyOtpMutation.mutateAsync({ email: props.email, otp: otp.value })
    .then((response) => {
      queryClient.invalidateQueries()
      queryClient.setQueryData('me', response.user)
      if (router.currentRoute.value.query.continueTo && !['/login', '/signup', '/verify-otp'].includes(router.currentRoute.value.query.continueTo)) {
        router.push(router.currentRoute.value.query.continueTo)
      } else {
        router.push({ name: 'projects' })
      }
    })
}

const isCountingDown = ref(false)
const resendBtnLabel = ref('Resend code')
function resendOtp () {
  resendOtpMutation.mutateAsync(props.email)
    .then(() => {
      isCountingDown.value = true
      let timeLeft = 60
      const countDownInterval = setInterval(() => {
        resendBtnLabel.value = `Resending available in ${timeLeft}s`
        timeLeft--
        if (timeLeft <= 0) {
          clearInterval(countDownInterval)
          isCountingDown.value = false
          resendBtnLabel.value = 'Resend code'
        }
      }, 1000)
    })
}
</script>
