import Vue from "vue/dist/vue.esm.js"
import Main from "./main.vue"
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

new Vue({
    render: h => h(Main)
}).$mount('#app')