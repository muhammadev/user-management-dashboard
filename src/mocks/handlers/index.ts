import { handlers as userHandlers } from './users'
import { handlers as roleHandlers } from './roles'
import { handlers as authHandlers } from './auth'

export const handlers = [...userHandlers, ...roleHandlers, ...authHandlers]
