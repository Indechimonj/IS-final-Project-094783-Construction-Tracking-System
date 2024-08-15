import { boot } from 'quasar/wrappers'
import axios from 'axios'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'

const api = axios.create({ baseURL: 'http://localhost:3333' })

export default boot(({ app, router }) => {
  api.interceptors.response.use((response) => response, (error) => {
    const isErrorResponse = axios.isAxiosError(error) && error.response !== undefined
    if (isErrorResponse && error.response.status === 401 && !['signup', 'login', 'verify-otp'].includes(router.currentRoute.value.name)) {
      router.push({ name: 'login', query: { continueTo: router.currentRoute.value.fullPath } })
    }
    return Promise.reject(error)
  })

  const globalQueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        networkMode: 'always',
        retry: false,
        staleTime: 1000 * 60 * 2 // 2 minutes
      }
    }
  })
  app.use(VueQueryPlugin, { queryClient: globalQueryClient })
})

export { api }
