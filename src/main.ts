import './assets/main.css'

import { createApp, markRaw } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from "primevue/config";
import Aura from '@primeuix/themes/aura';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';

import App from './App.vue'
import router from './router'

// register router with pinia
const pinia = createPinia()
pinia.use(({ store }) => {
  store.router = markRaw(router);
})


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

  app.use(pinia)
  app.use(router)
  app.use(PrimeVue, {
    theme: {
      preset: Aura,
      options: {
        darkModeSelector: '.dark',
        cssLayer: false
      }
    }
  })
  app.use(ToastService)
  app.use(ConfirmationService)

  app.mount('#app')
})
