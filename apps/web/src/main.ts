import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import App from './App.vue';
import { createPinia } from 'pinia';
import { router } from './router';
import { permissionDirective } from './directives/permission';
import './style.css';

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(ElementPlus);
app.directive('permission', permissionDirective);
app.mount('#app');
