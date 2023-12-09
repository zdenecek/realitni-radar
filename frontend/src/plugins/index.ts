/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from './vuetify'
import router from '../router'
import initCharts from './chartjs'
import unhead from './unhead'
import pinia from './pinia'
import './utils'

// Types
import type { App } from 'vue'

export function registerPlugins (app: App) {
  app
    .use(vuetify)
    .use(router)
    .use(unhead)
    .use(pinia);

  initCharts();  

}
