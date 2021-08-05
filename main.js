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
        activeTool: qs.parse(location.search).k || "repo",
        repos: [
            ["sql", "基于 sqlx 实现更易用的sql, 接口优雅的同时媲美 sqlx 的性能"],
            ["error", "错误处理指南和错误码"],
            ["http", "Go 官方 net/http 标准库和 mux 的扩展, 对错误处理友好"],
            ["session", "安全易用的 session golang 库"],
            ["validator", "类型安全的结构体数据验证器"],
            ["json", "go 宽容的JSON处理, Marshal 支持 nil => [] , Unmarshal 支持 string => int or float"],
            ["time", "time 的一些便捷扩展"],
        ]
    }
}
const methods = {
    changeTag: function (value, e) {
        const vm = this
        history.pushState({}, "", `${location.pathname}?k=${vm.activeTool}`);
    },
    handleChangeCollapse: function(v,b) {
        console.log(v);
    },
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
