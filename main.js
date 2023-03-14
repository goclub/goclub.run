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
            ["boot", "项目脚手架，让开发go服务更容易，开箱即用", false],
            ["error", "错误处理指南和错误码", true],
            ["validator", "类型安全的结构体数据验证器", true],
            ["http", "Go 官方 net/http 标准库和 mux 的扩展, 对错误处理友好", true],
            ["session", "安全易用的 session golang 库", true],
            ["sql", "基于 sqlx 实现更易用的sql, 接口优雅的同时媲美 sqlx 的性能", true],
            ["redis", "go redis 封装, 接口设计易用友好", false],
            ["mongo", "go mongoDB 封装, Go版本教程 + 更易用的接口设计", true, 'https://mongo.goclub.run/'],
            ["rabbitmq", "go rabbitmq 封装, 支持断线重连.", false],
            ["sync", "go 并发编程教程和工具", true],
            ["json", "go 宽容的JSON处理, Marshal 支持 nil => [] , Unmarshal 支持 string => int or float", true],
            ["time", "time 的一些便捷扩展", true],
            ["captcha", "图形验证码", false],
            ['test', '测试工具,用于生产测试数据和测试函数', false],
            ["docker", "本地后盾开发环境 docker 配置", false],
            ["rand", "随机生成器", false],
            ["lottery", "由浅入深的实现可配置的概率和计数抽奖", false],
            ["crypto", "封装后更易用的加密", false],
            ["conv", "类型转换", false],
            ['base64', "base64编码解码", false],
            ['lbs', "中国省市区行政编码转换工具和数据库"],
            ['qiniu', "封装七牛 Go SDK，以更友好的接口上传文件", false],
            ['type', "go 类型增强", false],
            ['ratelimit', '速率限制', false],
            ['oauth', 'oauth 教程', false],
            ['rpc', 'rpc 教程', false],
        ]
    }
}
const methods = {
    link: function (item) {
        if (item[3]) {
            return item[3]
        }
        if (item[2]) {
            return 'https://goclub.run/' + item[0]
        } else {
            return 'https://github.com/goclub/' + item[0]
        }
    },
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
