import { registerPlugins } from '@/plugins'
import App from './App.vue'
import { createApp } from 'vue'


const app = createApp(App)

registerPlugins(app)
app.mount('#app')


export const firefoxUrl = import.meta.env.VITE_FIREFOX_EXTENSION_DOWNLOAD_URI;
export const chromeUrl = import.meta.env.VITE_CHROME_EXTENSION_DOWNLOAD_URI;
