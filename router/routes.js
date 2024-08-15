const routes = [
  {
    path: '',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/projects/ProjectsPage.vue'), name: 'projects', alias: '/' }
    ]
  },
  {
    path: '/signup',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/SignupPage.vue'), name: 'signup' }
    ]
  },
  {
    path: '/login',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/LoginPage.vue'),
        name: 'login',
        props: route => ({
          continueTo: route.query.continueTo
        })
      }
    ]
  },
  {
    path: '/verify-otp',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/OtpPage.vue'),
        name: 'verify-otp',
        props: route => ({
          email: route.query.email,
          continueTo: route.query.continueTo
        })
      }
    ]
  },
  {
    path: '/projects',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'new',
        component: () => import('pages/projects/NewProjectPage.vue'),
        name: 'projects:new'
      },
      {
        path: ':id',
        component: () => import('pages/projects/IndividualProjectPage.vue'),
        props: route => ({ projectId: route.params.id }),
        children: [
          {
            path: '',
            component: () => import('components/ProjectTasksList.vue'),
            props: route => ({ projectId: route.params.id }),
            name: 'project'
          },
          {
            path: 'resources',
            component: () => import('src/components/ProjectResources.vue'),
            props: route => ({ projectId: route.params.id }),
            name: 'project:resources'
          },
          {
            path: 'issues',
            component: () => import('src/components/ProjectIssues.vue'),
            props: route => ({ projectId: route.params.id }),
            name: 'project:issues'
          },
          {
            path: 'documents',
            component: () => import('src/components/ProjectDocuments.vue'),
            props: route => ({ projectId: route.params.id }),
            name: 'project:documents'
          }
        ]
      }
    ]
  },
  {
    path: '/tasks/:id',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndividualTaskPage.vue'),
        name: 'tasks',
        props: route => ({ id: route.params.id })
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
