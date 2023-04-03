import hljs from "highlight.js";
import "highlight.js/lib/languages/go.js";
import "highlight.js/styles/base16/solarized-light.css";
import tpl from "./tpl.js"
import code from "./code.js"
import * as ejs from "ejs"
import copy from "copy-to-clipboard"
import {snakeCase} from "snake-case"

function toTitle(s) {
    if (s == "") {
        return ""
    }
    if (s == `[]byte`) {
        return 'Bytes'
    }
    return s.replace(s[0], s[0].toUpperCase())
}

function firstLetterToLowerCase(s) {
    if (s == "") {
        return ""
    }
    if (/^[A-Z]+$/.test(s)) {
        return s.toLowerCase()
    }
    return s.replace(s[0], s[0].toLowerCase())
}

function strToCamel(str) {
    return str.replace(/(^|_)(\w)/g, (m, $1, $2) => $2.toUpperCase());
}

function govalue(type, value) {
    value = String(value)
    switch (type) {
        case "string":
            return `"${value}"`
            break
        case "[]byte":
            return `[]byte("${value}")`
            break
        default:
            return value
    }
}

function jsCodeValue(v, item) {
    if (v.type != 'uint8') {
        return `"${item.value}"`
    }
    return item.value
}

const components = {}
export default {
    name: 'spec-enum',
    components,
    template: tpl,
    computed: {
        enumsFileName() {
            const vm = this
            return 'enum_' + snakeCase(vm.enums.name) + '.go'
        },
        enumsResult() {
            const vm = this
            const v = vm.enums
            let maxItemFieldLen = 0
            v.items.forEach(function (item, index) {
                if (maxItemFieldLen < item.field.length) {
                    maxItemFieldLen = item.field.length
                }
            })
            v.items = v.items.map(function (item, index) {
                if (index != v.items.length - 1) {
                    item.tailed = ", "
                }
                return item
            })
            return ejs.render(code, {
                backqueto: "`",
                v: v,
                maxItemFieldLen: maxItemFieldLen,
                govalue,
                strToCamel,
                firstLetterToLowerCase,
                toTitle,
                jsCodeValue,
            }, {delimiter: "#"})
        },
        enumsResultCode() {
            // hljs
            const vm = this
            return hljs.highlight("go", vm.enumsResult).value
        }
    },
    methods: {
        copyFilename() {
            const vm = this
            copy(vm.enumsFileName)
            vm.$message({
                message: '文件名已复制到粘贴板',
                type: "success",
            });
        },
        copyCode() {
            const vm = this
            copy(vm.enumsResult)
            vm.$message({
                message: '代码已复制到粘贴板',
                type: "success",
            });
        },
        exampleMarkEnumsBySource() {
            const vm = this
            vm.source.enums = `{"name":"LogKind","type":"uint8","items":[{"field":"Info","value":"1","tailed":", ","label":"信息"},{"field":"Danger","value":"2","label":"危险"}]}`
            vm.markEnumsBySource()
        },
        markEnumsBySource() {
            const vm = this
            let sourceJSON = vm.source.enums.replace("//", "")
            let data = {}
            try {
                data = JSON.parse(sourceJSON)
            } catch {
                alert("源格式错误")
            }
            vm.enums = data
        },
        createNewItem() {
            const vm = this
            let newItem = {
                field: "",
                value: "",
            }
            // 自动填充一个期望值
            switch (vm.enums.type) {
                case "uint8":
                    if (vm.enums.items.length == 0) {
                        newItem.value = 1
                    } else {
                        let maxNumber = 1
                        vm.enums.items.forEach(function (item) {
                            let value = item.value
                            console.log(value, maxNumber)
                            if (value > maxNumber) {
                                maxNumber = value
                            }
                        })
                        newItem.value = parseInt(maxNumber) + 1
                    }
                    break
            }
            vm.enums.items = vm.enums.items.concat([newItem])
        },
        removeEnumsItem(removeIndex) {
            const vm = this
            vm.enums.items = vm.enums.items.filter(function (item, index) {
                return index != removeIndex
            })
        },
        amendEnumsName(value) {
            const vm = this
            let v = vm.enums.name
            if (v == "") {
                return
            }
            vm.enums.name = v.replace(v[0], v[0].toUpperCase());
        },
        amendEnumsItemsValue(index) {
            const vm = this
            let value = vm.enums.items[index].value
            vm.enums.items.map(function (item, i) {
                if (i == index) {
                    if (item.field == "") {
                        item.field = strToCamel(item.value)
                    }
                }
                return item
            })
            vm.enums.items.some(function (item, i) {
                if (i == index) {
                    return
                }
                if (item.value == value) {
                    alert(item.field + ":" + item.value + " 重复")
                    return true
                }
            })
            // vm.enums.items[*].value 如果为 0 则 alert
            vm.enums.items.some(function (item, index) {
                if (item.value == 0) {
                    alert("枚举值不能为 0")
                    return true
                }
            })
        },
        amendEnumsItemsField(index) {
            const vm = this
            let field = vm.enums.items[index].field
            if (field == "") {
                return
            }
            field = field.replace(field[0], field[0].toUpperCase());
            vm.enums.items[index].field = field
            switch (vm.enums.type) {
                case "string":
                case "[]byte":
                    if (vm.enums.items[index].value == "") {
                        vm.enums.items[index].value = field.replace(field[0], field[0].toLowerCase());
                        vm.amendEnumsItemsValue(index)
                    }
                    break
            }
        },
        blurModelTableName() {
            const vm = this
            if (vm.model.tableName == "") return
            if (vm.model.tableStructName == "") {
                vm.model.tableStructName = "Table" + strToCamel(vm.model.tableName.replace(/s$/, ""))
            }
        },
    },
    data: function () {
        return {
            options: {
                enumsType: [
                    "[]byte", "string",
                    "uint8",
                ]
            },
            source: {
                enums: "",
            },
            enums: {
                name: "",
                type: "uint8",
                items: [],
            },
            model: {
                tableName: "",
                tableStructName: "",
            },
        }
    }
}