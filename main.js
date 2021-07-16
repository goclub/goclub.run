import Vue from "vue/dist/vue.esm.js"
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
import SpecEnum from "./com/enum/main.js"
import SpecModel from "./com/model/main.js"
import GenQrcode from "./com/qrcode/main.js"
import GenUUID from "./com/uuid/main.js"
const components = {}
import qs from "query-string"
components[SpecEnum.name] = SpecEnum
components[SpecModel.name] = SpecModel
components[GenQrcode.name] = GenQrcode
components[GenUUID.name] = GenUUID
const TAG_KEY = "tag_key_v1"
const data = function () {
    return {
        activeTool: qs.parse(location.search).kind || localStorage.getItem(TAG_KEY)
    }
}
const methods = {
    changeTag: function (value, e) {
        const vm = this
        localStorage.setItem(TAG_KEY, vm.activeTool)
    }
}
var app = new Vue({
    el: '#app',
    components,
    data,
    methods,
})