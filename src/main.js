import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/index.scss'
console.log(import.meta.env.VITE_APP_BASE_API, 'import.meta.env.VITE_APP_BASE_API');
createApp(App).use(router).mount('#app')
