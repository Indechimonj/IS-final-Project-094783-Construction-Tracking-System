<template>
  <q-page class="grid sm:grid-cols-[40%,_1fr]">
    <q-img src="photos/silvia-brazzoduro-YSxcf6C_SEg-unsplash.webp"></q-img>
    <div class="fit flex flex-center">
      <q-form @submit.prevent="submit" class="column gap-4 max-w-[90dvw] sm:max-w-[500px] w-full mt-5 sm:mt-10 p-6 sm:p-7 h-fit">
        <div class="column gap-2">
          <h4 class="text-h4">Log In</h4>
          <h5 class="text-h5 text-grey-8">Welcome back</h5>
        </div>
        <q-banner class="bg-rose-200 rounded-md text-body1" inline-actions v-show="loginMutation.isError">
          {{ loginMutation.error?.message }}
          <template v-slot:action>
            <q-btn flat icon="mdi-close-circle" round dense @click="loginMutation.reset" />
          </template>
        </q-banner>
        <div class="column">
          <label for="email" class="mb-2 text-body1 font-medium">Email</label>
          <q-input v-model="email" type="email" outlined placeholder="Enter email here" required class="text-body1" autocomplete="email">
            <template #prepend>
              <q-icon name="mdi-email"></q-icon>
            </template>
          </q-input>
        </div>
        <q-btn label="Continue" no-caps class="w-full rounded-md" size="lg" color="primary" type="submit" :loading="loginMutation.isPending" :disabled="loginMutation.isPending">
          <template #loading>
            <q-spinner-ios></q-spinner-ios><span class="ml-2">Loading...</span>
          </template>
        </q-btn>
        <div class="flex justify-center">
          <span>Don't have an account?</span>
          <RouterLink class="ml-1 text-blue-900 underline" :to="{ name: 'signup' }">Create One</RouterLink>.
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script setup>
import { useMutation } from '@tanstack/vue-query'
import { sendOtp } from 'src/composables/api'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')

const loginMutation = reactive(useMutation({
  mutationKey: ['sendOtp'],
  mutationFn: sendOtp
}))

function submit () {
  loginMutation.mutateAsync(email.value)
    .then(() => {
      router.push({
        name: 'verify-otp',
        query: {
          email: email.value,
          continueTo: router.currentRoute.value.query.continueTo
        }
      })
    })
}
</script>
