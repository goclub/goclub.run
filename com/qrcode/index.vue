<template>
    <div>
        <el-form size="mini">
            <el-form-item label="">
                <el-tag style="cursor: pointer;" size="mini" @click="addPrefix('https://')">https://</el-tag>
                |
                <el-tag style="cursor: pointer;" size="mini" @click="addPrefix('http://')">http://</el-tag>
                <el-input ref="qrcodeInput" placeholder="请输入二维码内容" type="textarea"
                          v-model="form.qrcode"></el-input>
            </el-form-item>
            <el-form-item label="">
                <el-button @click="clickRenderButton" plain type="primary" style="width:100%" size="large">生成
                </el-button>
            </el-form-item>
        </el-form>
        <el-row>
            <el-col :span="10" :xs="12">
                <div style="padding-left: 0em;">
                    <div style="padding-top: 1em;margin-bottom: 10px;">
                        尺寸:
                        <el-input-number :step="20" v-model="form.size" :min="50" :max="1000"></el-input-number>
                    </div>
                    <div style="padding:1em;background: white;border:1px solid #ddd;display:inline-block;">
                        <qrcode-vue :value="result" :size="form.size"></qrcode-vue>
                    </div>
                </div>
            </el-col>
            <el-col :span="14" :xs="24">

                <div>
                    <el-switch v-model="showHistory"></el-switch>
                    二维码生成记录
                </div>
                <table style="width:100%;font-size: 14px;" v-if="showHistory">
                    <thead>
                    <tr style="text-align:left;">
                        <th>内容</th>
                        <th>时间</th>
                        <th style="min-width:3em;">操作</th>
                    </tr>
                    </thead>
                    <tr v-for="item in form.history" style="line-height:2em;">
                        <td>
                            {{ item.content }}
                        </td>
                        <td>{{ item.time }}</td>
                        <td>
                            <el-link type="primary" @click="useHistory(item.content)">生成</el-link>
                            |
                            <el-link @click="delHistory(item.content)" type="danger">删除</el-link>
                        </td>
                    </tr>
                </table>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import QrcodeVue from "qrcode.vue"
import dateFormat from "date-format"

const components = {
    QrcodeVue,
}
const FORM_KEY = "form_key_v4"
export default {
    name: 'gen-qrcode',
    components,
    computed: {
        result() {
            const vm = this
            return vm.render.trim()
        },
    },
    created: function () {
        const vm = this
        setTimeout(function () {
            vm.$refs.qrcodeInput.focus()
        }, 100)
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
            const vm = this
            if (this.render.trim() != "") {
                let repeat = this.form.history.some(function (item) {
                    return vm.render == item.content
                })
                if (repeat) {
                    return
                }
                this.form.history.unshift({
                    content: this.render,
                    time: dateFormat("yyyy-MM-dd hh:mm:ss"),
                })
            }
        },
        useHistory: function (text) {
            this.render = text
            this.form.qrcode = text
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
                this.form.qrcode = text + this.form.qrcode
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
            history: [],
        }
        let data = localStorage.getItem(FORM_KEY)
        if (data) {
            try {
                form = JSON.parse(data)
            } catch (err) {
                console.log(err)
            }
        }
        return {
            showHistory: false,
            render: "",
            form,
        }
    }
}

</script>