import { configApp } from '@adonisjs/eslint-config'
import local from './eslint-plugin-local/index.js'

export default [
  ...configApp(),

  {
    plugins: {
      local,
    },

    rules: {
      'local/no-direct-status-merge': 'error',
    },
  },
]
