<template>
  <q-page class="grid sm:grid-cols-[40%,_1fr]">
    <q-img src="photos/silvia-brazzoduro-YSxcf6C_SEg-unsplash.webp" class="sm:object-top" position="50% 20%"></q-img>
    <div class="fit flex flex-center">
      <q-form @submit.prevent="submit" class="column gap-4 sm:max-w-[500px] w-full h-fit mt-5 sm:mt-10 p-6 sm:p-7">
        <div class="column gap-2">
          <h5 class="text-h4">Sign Up</h5>
          <div class="text-h5 text-grey-8">Join us</div>
        </div>
        <q-banner class="bg-rose-200 rounded-md text-body1" inline-actions v-show="signupMutation.isError">
          {{ signupMutation.error?.message }}
          <template v-slot:action>
            <q-btn flat icon="mdi-close-circle" round dense @click="signupMutation.reset" />
          </template>
        </q-banner>
        <div class="column gap-2">
          <label for="role" class="text-body1">Role</label>
          <q-btn-toggle
            unelevated
            v-model="formData.role"
            class="w-fit border border-primary rounded-md"
            toggle-color="primary"
            :options="roleOptions"
          ></q-btn-toggle>
        </div>
        <div class="grid sm:grid-cols-2 gap-4">
          <q-input v-model="formData.firstName" type="text" outlined label="First Name" required class="text-body1" autocomplete="given-name">
            <template #prepend>
              <q-icon name="mdi-account-circle"></q-icon>
            </template>
          </q-input>
          <q-input v-model="formData.lastName" type="text" outlined label="Last Name" required class="text-body1" autocomplete="family-name">
            <template #prepend>
              <q-icon name="mdi-account-circle"></q-icon>
            </template>
          </q-input>
        </div>
        <q-input v-model="formData.email" type="email" outlined label="Email" required class="text-body1" autocomplete="email">
          <template #prepend>
              <q-icon name="mdi-email"></q-icon>
            </template>
        </q-input>
        <q-btn label="Sign Up" no-caps class="w-full rounded-md" size="lg" color="primary" type="submit" :loading="signupMutation.isPending" :disabled="signupMutation.isPending">
          <template #loading>
            <q-spinner-ios></q-spinner-ios><span class="ml-2">Signing up...</span>
          </template>
        </q-btn>
        <div class="flex justify-center">
          <span>Already have an account?</span>
          <RouterLink class="ml-1 text-blue-900 underline" :to="{ name: 'login' }">Log in</RouterLink>.
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script setup>
import { useMutation } from '@tanstack/vue-query'
import { sendOtp, signup } from 'src/composables/api'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const roleOptions = [
  { label: 'client', value: 'client' },
  { label: 'Contractor', value: 'contractor' }
]
const router = useRouter()
const formData = reactive({
  email: '',
  firstName: '',
  lastName: '',
  role: 'client'
})
const signupMutation = reactive(useMutation({
  mutationKey: ['signup'],
  mutationFn: signup
}))
function submit () {
  signupMutation.mutateAsync(formData)
    .then(() => {
      sendOtp(formData.email)
      router.push({ name: 'verify-otp', query: { email: formData.email } })
    })
}
</script>
