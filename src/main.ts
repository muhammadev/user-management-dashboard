import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from "primevue/config";
import Aura from '@primeuix/themes/aura';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';

import App from './App.vue'
import router from './router'

async function enableMocking() {
  if (import.meta.env.MODE === "development") {
    try {
      const { worker } = await import("./mocks/browser");
      await worker.start()
    } catch (err) {
      console.error("MSW failed to start", err)
    }
  }
}

enableMocking().then(() => {
  const app = createApp(App)

  app.use(createPinia())
  app.use(router)
  app.use(PrimeVue, {
    theme: {
      preset: Aura,
      options: {
        darkModeSelector: 'system',
        cssLayer: false
      }
    }
  })
  app.use(ToastService)
  app.use(ConfirmationService)

  app.mount('#app')
})