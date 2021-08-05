import Vue from "vue/dist/vue.esm.js"
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
import SpecEnum from "./com/enum/main.js"
import SpecModel from "./com/model/main.js"
import GenQrcode from "./com/qrcode/main.js"
import GenUUID from "./com/uuid/main.js"
import GithubButton from 'vue-github-button'
import qs from "query-string"
const components = {
    GithubButton
}


components[SpecEnum.name] = SpecEnum
components[SpecModel.name] = SpecModel
components[GenQrcode.name] = GenQrcode
components[GenUUID.name] = GenUUID
const data = function () {
    return {
        activeTool: qs.parse(location.search).k || "repo"
    }
}
const methods = {
    changeTag: function (value, e) {
        const vm = this
        history.pushState({}, "", `${location.pathname}?k=${vm.activeTool}`);
    }
}
var app = new Vue({
    el: '#app',
    components,
    data,
    methods,
    created: function () {
        
    }
})



app.$el.style.display="block"
