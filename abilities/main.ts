/*
|--------------------------------------------------------------------------
| Bouncer abilities
|--------------------------------------------------------------------------
|
| You may export multiple abilities from this file and pre-register them
| when creating the Bouncer instance.
|
| Pre-registered policies and abilities can be referenced as a string by their
| name. Also they are must if want to perform authorization inside Edge
| templates.
|
*/

import Issue from '#models/issue'
import type Project from '#models/project'
import Task from '#models/task'
import type User from '#models/user'
import { Bouncer } from '@adonisjs/bouncer'

const userIsClientOrContractor = (user: User, project: Project) => {
  return user.roles !== undefined && (user.id === project.contractorId || user.id === project.clientId)
}

const userIsClient = (user: User, project: Project) => {
  return user.roles !== undefined && user.id === project.clientId
}

// const userHasRole = (user: User, role: 'client' | 'contractor' | 'admin') => {
//   return user.roles !== undefined && user.roles.includes(role)
// }

/**
 * Delete the following ability to start from
 * scratch
 */
export const canCreateProject = Bouncer.ability((user: User) => {
  return user.roles !== undefined && user.roles.includes('client')
})

export const canViewProject = Bouncer.ability(async (user: User, project: Project, userEmployers: User[]) => {
  return userIsClientOrContractor(user, project) || userEmployers.some((employer) => { return employer.id === project.contractorId })
})

export const canEditProject = Bouncer.ability(userIsClientOrContractor)

export const canDeleteProject = Bouncer.ability(userIsClient)

export const canCreateTask = Bouncer.ability(userIsClientOrContractor)

export const canEditTask = Bouncer.ability((user: User, project: Project, task: Task) => {
  return user.roles !== undefined && (user.id === task.createdByUserId || user.id === project.clientId)
})

export const canDeleteTask = Bouncer.ability((user: User, project: Project, task: Task) => {
  return user.roles !== undefined && (user.id === task.createdByUserId || user.id === project.clientId)
})

export const canCreateResource = Bouncer.ability(userIsClientOrContractor)

export const canEditResource = Bouncer.ability(userIsClientOrContractor)

export const canDeleteResource = Bouncer.ability(userIsClient)

export const canAllocateResource = Bouncer.ability(userIsClientOrContractor)

export const canEditResourceAllocation = Bouncer.ability(userIsClientOrContractor)

export const canDeleteResourceAllocation = Bouncer.ability(userIsClient)

export const canCreateIssue = Bouncer.ability(userIsClientOrContractor)

export const canEditIssue = Bouncer.ability(userIsClientOrContractor)

export const canDeleteIssue = Bouncer.ability((user: User, issue: Issue) => {
  return user.id === issue.reportedByUserId || (user.roles !== undefined && user.roles.includes('client'))
})

export const canCreateDocument = Bouncer.ability(userIsClientOrContractor)

export const canDownloadDocument = Bouncer.ability(userIsClientOrContractor)

export const canEditDocument = Bouncer.ability(userIsClientOrContractor)

export const canDeleteDocument = Bouncer.ability(userIsClient)
