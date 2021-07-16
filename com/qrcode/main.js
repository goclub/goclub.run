import tpl from "./tpl.js"
import QrcodeVue from "qrcode.vue"
import dateFormat from "date-format"
const components = {
    QrcodeVue,
}
const FORM_KEY = "form_key_v4"
export default {
    name: 'gen-qrcode',
    components,
    template: tpl,
    computed:{
        result() {
            const vm = this
            return vm.render.trim()
        },
    },
    created: function () {
        const vm = this
        setTimeout(function callee() {
            let data = JSON.stringify(vm.form)
            localStorage.setItem(FORM_KEY, data)
            setTimeout(callee, 1000)
        }, 1000)
        this.render = this.form.qrcode
    },
    methods: {
        clickRenderButton: function () {
            this.render = this.form.qrcode
            if (this.render.trim() != "") {
                this.form.history = this.form.history.concat({
                    content: this.render,
                    time: dateFormat("yyyy-MM-dd hh:mm:ss"),
                })
            }
        },
        useHistory: function (text) {
            this.render = text
        },
        delHistory: function (text) {
            this.form.history = this.form.history.filter(function (item) {
                console.log(item, text)
                return item.content != text
            })
        },
        addPrefix: function (text) {
            this.form.qrcode = this.form.qrcode.trim()
            if (this.form.qrcode.indexOf("http") != 0) {
                this.form.qrcode  = text + this.form.qrcode
            }
            this.$refs.qrcodeInput.focus()
        },
        clearHistory: function () {
            this.form.history = []
        }
    },
    data: function () {
        let form = {
            qrcode: "",
            size: 300,
            history:[],
        }
        let data = localStorage.getItem(FORM_KEY)
        if (data) {
            try {
                form = JSON.parse(data)
            }catch (err) {
                console.log(err)
            }
        }
        return {
            render: "",
            form,
        }
    }
}