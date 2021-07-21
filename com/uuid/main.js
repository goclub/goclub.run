import tpl from "./tpl.js"

import copy from "copy-to-clipboard"
import {v4 as uuidv4} from "uuid"
const components = {

}
export default {
    name: 'gen-uuid',
    components,
    template: tpl,
    computed:{
        shortUUID() {
            return this.UUID.replaceAll("-", "")
        }
    },
    methods: {
        copyUUID() {
            const vm = this
            copy(vm.UUID)
            vm.$message({
                message: 'uuid已复制到粘贴板',
                type: "success",
            });
        },
        copyShortUUID() {
            const vm = this
            copy(vm.shortUUID)
            vm.$message({
                message: 'short uuid已复制到粘贴板',
                type: "success",
            });
        },
        refreshUUID() {
            this.UUID = uuidv4()
        },
    },
    data: function () {
        return {
            UUID: uuidv4(),
        }
    }
}