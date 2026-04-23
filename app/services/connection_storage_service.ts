import { AsyncLocalStorage } from 'node:async_hooks'

export const connectionStorage = new AsyncLocalStorage<string>()
