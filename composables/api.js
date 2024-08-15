import { infiniteQueryOptions, queryOptions } from '@tanstack/vue-query'
import { isAxiosError } from 'axios'
import { Notify } from 'quasar'
import { api } from 'src/boot/axios'
import { toValue } from 'vue'

export async function useAxiosAsync (opts) {
  // Run before fetch
  if (opts.beforeFetch !== undefined) opts.beforeFetch()
  const headers = {}
  if (opts.data instanceof FormData) {
    headers['content-type'] = 'multipart/form-data'
  }

  try {
    const response = await api({
      url: opts.url,
      method: opts.method,
      data: opts.data || {},
      params: opts.params || {},
      headers,
      withCredentials: true
    })
    if (opts.successNotif) {
      Notify.create({
        message: response.data.message || 'Success',
        type: 'positive'
      })
    }
    return response.data
  } catch (RequestError) {
    let error = 'Something went wrong'
    let title = 'Uh, oh! Something went wrong'
    if (isAxiosError(RequestError)) {
      if (RequestError.response === undefined) {
        error = 'Could not connect to the server'
      } else if (RequestError.response.status === 422) {
        const key = Object.keys(RequestError.response.data.errors)[0]
        error = RequestError.response.data.errors[key].message
      } else if (RequestError.response.status === 401 && RequestError.response.data.errors?.message === 'Unauthorized access') {
        error = 'You are not logged in'
        opts.errorNotif = true
      } else if (RequestError.response.data.message !== undefined) {
        error = RequestError.response.data.message
        if (RequestError.response.status === 404) {
          let entity = error.match(/(?<entity>\w+\S) not found/)
          entity = entity ? entity.groups?.entity : undefined
          title = error
          error = entity ? `We could not find the ${entity} you are looking for!` : error
        } else if (RequestError.response.status === 403) {
          title = 'Access Denied'
        }
      }
    }
    if (opts.errorNotif) {
      Notify.create({
        message: (typeof (opts.errorNotif) === 'string') ? opts.errorNotif : error,
        type: 'negative'
      })
    }
    RequestError.message = error
    RequestError.title = title
    throw RequestError
  }
}

/* AUTH */
export const signup = async (data) => useAxiosAsync({
  url: '/auth/signup',
  method: 'POST',
  data,
  successNotif: true
})

export const sendOtp = async (email) => useAxiosAsync({
  url: '/auth/send-otp',
  method: 'POST',
  data: { email },
  successNotif: true
})

export const verifyOtp = async (data) => useAxiosAsync({
  url: '/auth/verify-otp',
  method: 'POST',
  data,
  successNotif: true
})

export const getCurrentUserOptions = queryOptions({
  queryKey: ['me'],
  queryFn: async () => await useAxiosAsync({
    url: '/auth/me',
    method: 'GET'
  }),
  select: (data) => data.user
})

export const logout = async () => useAxiosAsync({
  url: '/auth/logout',
  method: 'POST',
  successNotif: true,
  errorNotif: true
})

/* PROJECTS */
export const createProject = async (data) => useAxiosAsync({
  url: '/projects',
  method: 'POST',
  data,
  successNotif: true
})

export const viewPaginatedProjectsQueryOptions = (limit) => infiniteQueryOptions({
  queryKey: ['projects', { limit }],
  queryFn: async ({ pageParam = undefined }) => await useAxiosAsync({
    url: '/projects',
    method: 'GET',
    params: { _cursor: pageParam, _limit: limit }
  }),
  getNextPageParam: (lastPage) => lastPage.nextPageCursor,
  initialPageParam: undefined,
  select: (data) => data.pages.flatMap((page) => page.records)
})

export const getProjectByIdQueryOptions = (id) => queryOptions({
  queryKey: ['project', { id }],
  queryFn: async () => await useAxiosAsync({
    url: `/projects/${toValue(id)}`,
    method: 'GET'
  }),
  select: (data) => data.project
})

export const deleteProject = async (id) => useAxiosAsync({
  url: `/projects/${toValue(id)}`,
  method: 'DELETE',
  successNotif: true
})

/* TASKS */

export const createTask = async (data) => useAxiosAsync({
  url: `/projects/${data.projectId}/tasks`,
  method: 'POST',
  data,
  successNotif: true
})

export const viewPaginatedTasksQueryOptions = (projectId, limit) => infiniteQueryOptions({
  queryKey: ['tasks', { projectId, limit }],
  queryFn: async ({ pageParam = undefined }) => await useAxiosAsync({
    url: `/projects/${toValue(projectId)}/tasks`,
    method: 'GET',
    params: { _cursor: pageParam, _limit: limit }
  }),
  getNextPageParam: (lastPage) => lastPage.nextPageCursor,
  initialPageParam: undefined,
  select: (data) => data.pages.flatMap((page) => page.records)
})

export const getTaskByIdQueryOption = (id) => queryOptions({
  queryKey: ['task', { id }],
  queryFn: async () => await useAxiosAsync({
    url: `/tasks/${toValue(id)}`,
    method: 'GET'
  }),
  select: (data) => data.task
})

export const deleteTask = async (id) => useAxiosAsync({
  url: `/tasks/${toValue(id)}`,
  method: 'DELETE',
  successNotif: true
})

export const createResourceAllocation = async (data) => useAxiosAsync({
  url: `/tasks/${data.taskId}/resource-allocations`,
  method: 'POST',
  data: data.formdata,
  successNotif: true
})

export const viewPaginatedResourceAllocationsQueryOptions = (taskId, limit) => infiniteQueryOptions({
  queryKey: ['resourceAllocations', { taskId, limit }],
  queryFn: async ({ pageParam = undefined }) => await useAxiosAsync({
    url: `/tasks/${toValue(taskId)}/resource-allocations`,
    method: 'GET',
    params: { _cursor: pageParam, _limit: limit }
  }),
  getNextPageParam: (lastPage) => lastPage.nextPageCursor,
  initialPageParam: undefined,
  select: (data) => data.pages.flatMap((page) => page.records)
})

export const viewPaginatedResourcesQueryOptions = (projectId, limit) => infiniteQueryOptions({
  queryKey: ['resources', { projectId, limit }],
  queryFn: async ({ pageParam = undefined }) => await useAxiosAsync({
    url: `/projects/${toValue(projectId)}/resources`,
    method: 'GET',
    params: { _cursor: pageParam, _limit: limit }
  }),
  getNextPageParam: (lastPage) => lastPage.nextPageCursor,
  initialPageParam: undefined,
  select: (data) => data.pages.flatMap((page) => page.records)
})

export const getResourceAllocationByIdQueryOption = (id) => queryOptions({
  queryKey: ['resourceAllocation', { id }],
  queryFn: async () => await useAxiosAsync({
    url: `/resource-allocations/${toValue(id)}`,
    method: 'GET'
  }),
  select: (data) => data.resourceAllocation
})

export const deleteResourceAllocation = async (id) => useAxiosAsync({
  url: `/resource-allocations/${toValue(id)}`,
  method: 'DELETE',
  successNotif: true,
  errorNotif: true
})

export const viewFilteredResourcesQueryOptions = (taskQueryResult, filter) => infiniteQueryOptions({
  queryKey: ['resources', { projectId: taskQueryResult.data?.projectId, limit: 10, filter }],
  queryFn: async ({ pageParam = undefined }) => await useAxiosAsync({
    url: `/projects/${toValue(taskQueryResult.data.projectId)}/resources`,
    method: 'GET',
    params: { _cursor: pageParam, _limit: 10, name: toValue(filter) }
  }),
  getNextPageParam: (lastPage) => lastPage.nextPageCursor,
  initialPageParam: undefined,
  select: (data) => data.pages.flatMap((page) => page.records),
  enabled: () => taskQueryResult.data !== undefined
})

export const createResource = async (data) => useAxiosAsync({
  url: `/projects/${data.projectId}/resources`,
  method: 'POST',
  data,
  successNotif: true
})

export const viewPaginatedIssuesQueryOptions = (projectId, limit) => infiniteQueryOptions({
  queryKey: ['issues', { projectId, limit }],
  queryFn: async ({ pageParam = undefined }) => await useAxiosAsync({
    url: `/projects/${toValue(projectId)}/issues`,
    method: 'GET',
    params: { _cursor: pageParam, _limit: limit }
  }),
  getNextPageParam: (lastPage) => lastPage.nextPageCursor,
  initialPageParam: undefined,
  select: (data) => data.pages.flatMap((page) => page.records)
})

export const createIssue = async (data) => useAxiosAsync({
  url: `/projects/${data.projectId}/issues`,
  method: 'POST',
  data,
  successNotif: true
})

export const viewPaginatedDocumentsQueryOptions = (projectId, limit) => infiniteQueryOptions({
  queryKey: ['documents', { projectId, limit }],
  queryFn: async ({ pageParam = undefined }) => await useAxiosAsync({
    url: `/projects/${toValue(projectId)}/documents`,
    method: 'GET',
    params: { _cursor: pageParam, _limit: limit }
  }),
  getNextPageParam: (lastPage) => lastPage.nextPageCursor,
  initialPageParam: undefined,
  select: (data) => data.pages.flatMap((page) => page.records)
})

export const createDocument = async (data) => useAxiosAsync({
  url: `/projects/${data.get('projectId')}/documents`,
  method: 'POST',
  data,
  successNotif: true
})
