import tpl from "./tpl.js"

import copy from "copy-to-clipboard"
import {v4 as uuidv4} from "uuid"

import {nanoid} from "nanoid"

const components = {}
export default {
    name: 'gen-id',
    components,
    template: tpl,
    computed: {
        shortUUID() {
            return this.UUID.replaceAll("-", "")
        }
    },
    methods: {
        changeNanoidLength() {
            this.nanoid = nanoid(this.nanoidLength)
        },
        copy(key) {
            const vm = this
            copy(vm[key])
            vm.$message({
                message: key + '已复制到粘贴板',
                type: "success",
            });
        },
        refresh() {
            this.UUID = uuidv4()
            this.nanoid = nanoid(this.nanoidLength)
        },
    },
    data: function () {
        var nanoidLength = 21
        return {
            nanoidLength: nanoidLength,
            nanoid: nanoid(nanoidLength),
            UUID: uuidv4(),
        }
    }
}