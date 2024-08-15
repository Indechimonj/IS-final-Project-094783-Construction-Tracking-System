/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const AuthController = () => import('#controllers/auth_controller')
const ProjectsController = () => import('#controllers/projects_controller')
const TasksController = () => import('#controllers/tasks_controller')
const ResourcesController = () => import('#controllers/resources_controller')
const IssuesController = () => import('#controllers/issues_controller')
const DocumentsController = () => import('#controllers/documents_controller')
const ReportsController = () => import('#controllers/reports_controller')
const ResourceAllocationsController = () => import('#controllers/resource_allocations_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.post('/auth/signup', [AuthController, 'signUp'])
router.post('/auth/send-otp', [AuthController, 'sendOtp'])
router.post('/auth/verify-otp', [AuthController, 'verifyOtp'])
router.get('/auth/me', [AuthController, 'userInfo']).use(middleware.auth())
router.post('/auth/logout', [AuthController, 'logout']).use(middleware.auth())

router.post('/projects', [ProjectsController, 'createProject']).use(middleware.auth())
router.get('/projects', [ProjectsController, 'getProjectsPaginated']).use(middleware.auth())
router.get('/projects/:id', [ProjectsController, 'getProjectById']).use(middleware.auth())
router.patch('/projects/:id', [ProjectsController, 'updateProjectById']).use(middleware.auth())
router.delete('/projects/:id', [ProjectsController, 'deleteProjectById']).use(middleware.auth())

router.post('/projects/:projectId/tasks', [TasksController, 'createTask']).use(middleware.auth())
router.get('/projects/:projectId/tasks', [TasksController, 'getTasksPaginated']).use(middleware.auth())
router.get('/tasks/:id', [TasksController, 'getTasksById']).use(middleware.auth())
router.patch('/tasks/:id', [TasksController, 'updateTaskById']).use(middleware.auth())
router.delete('/tasks/:id', [TasksController, 'deleteTaskById']).use(middleware.auth())

router.get('/tasks/:taskId/resource-allocations', [ResourceAllocationsController, 'getResourceAllocationsPaginated']).use(middleware.auth())
router.get('/resource-allocations/:id', [ResourceAllocationsController, 'getResourceAllocationById']).use(middleware.auth())
router.post('/tasks/:taskId/resource-allocations', [ResourceAllocationsController, 'createResourceAllocation']).use(middleware.auth())
router.patch('/resource-allocations/:id', [ResourceAllocationsController, 'updateResourceAllocationById']).use(middleware.auth())
router.delete('/resource-allocations/:id', [ResourceAllocationsController, 'deleteResourceAllocationById']).use(middleware.auth())

router.post('/projects/:projectId/resources', [ResourcesController, 'createResource']).use(middleware.auth())
router.get('/projects/:projectId/resources', [ResourcesController, 'getResourcesPaginated']).use(middleware.auth())
router.get('/resources/:id', [ResourcesController, 'getResourceById']).use(middleware.auth())
router.patch('/resources/:id', [ResourcesController, 'updateResourceById']).use(middleware.auth())
router.delete('/resources/:id', [ResourcesController, 'deleteResourceById']).use(middleware.auth())

router.post('/projects/:projectId/issues', [IssuesController, 'createIssue']).use(middleware.auth())
router.get('/projects/:projectId/issues', [IssuesController, 'getIssuesPaginated']).use(middleware.auth())
router.get('/issues/:id', [IssuesController, 'getIssueById']).use(middleware.auth())
router.patch('/issues/:id', [IssuesController, 'updateIssueById']).use(middleware.auth())
router.delete('/issues/:id', [IssuesController, 'deleteIssueById']).use(middleware.auth())

router.post('/projects/:projectId/documents', [DocumentsController, 'createDocument']).use(middleware.auth())
router.get('/projects/:projectId/documents', [DocumentsController, 'getDocumentsPaginated']).use(middleware.auth())
router.get('/documents/:id', [DocumentsController, 'getDocumentById']).use(middleware.auth())
router.patch('/documents/:id', [DocumentsController, 'updateDocumentById']).use(middleware.auth())
router.delete('/documents/:id', [DocumentsController, 'deleteDocumentById']).use(middleware.auth())
router.get('documents/:id/download', [DocumentsController, 'downloadDocument']).use(middleware.auth())

router.post('/projects/:projectId/reports', [ReportsController, 'createReport']).use(middleware.auth())
router.get('/projects/:projectId/reports', [ReportsController, 'getReportsPaginated']).use(middleware.auth())
router.get('/reports/:id', [ReportsController, 'getReportById']).use(middleware.auth())
router.patch('/reports/:id', [ReportsController, 'updateReportById']).use(middleware.auth())
router.delete('/reports/:id', [ReportsController, 'deleteReportById']).use(middleware.auth())

// router.get('/test', [AuthController, 'test'])
