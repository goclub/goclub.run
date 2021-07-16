import tpl from "./tpl.js"
import code from "./code.js";
import * as ejs from "ejs"
import { snakeCase } from "snake-case"
import copy from "copy-to-clipboard"

const components = {

}
function strCamelToSnake(str) {
    return snakeCase(str)
}


function strToCamel(str){
    return str.replace(/(^|_)(\w)/g,(m,$1,$2)=>$2.toUpperCase());
}
function strFirstLetterToLowCase(str){
    if (str ==  ""){return""}
    return str.replace(/(^|_)(\w)/g,(m,$1,$2)=>$2.toLowerCase());
}
function snakeToCamel(str) {
    var out = strToCamel(str.replace(
        /([-_][a-z])/g,
        function (group) {
            return group.toUpperCase()
                .replace('-', '')
                .replace('_', '')
        },
    )).replace(/Id$/, 'ID')
    return out
}
const MODEL_KEY = "goclub_boot_tools_model_v2"
const defaultModel = function () {
    return {
        packageName: "m",
            tableName: "",
        structName: "",
        softDelete: "",
        customSoftDelete: {
        SoftDeleteWhere: ``,
            SoftDeleteSet: ``,
        },
        fieldCreateUpdate: "",
            fields: [],
    }
}
export default {
    name: 'spec-model',
    components,
    template: tpl,
    computed:{
        modelResult() {
            const vm = this
            const v = vm.model
            let maxGoFeildLength = 0
            let maxGoTypeLength = 0
            vm.model.fields.forEach(function (item) {
                if (item.goField.length > maxGoFeildLength) {
                    maxGoFeildLength = item.goField.length
                }
                if (item.goType.length > maxGoTypeLength) {
                    maxGoTypeLength = item.goType.length
                }
            })
            maxGoFeildLength++
            maxGoTypeLength++
            function padGoField(item) {
                return item.goField.padEnd(maxGoFeildLength, " ")
            }
            function padGolFieldValue(field) {
                return field.padEnd(maxGoFeildLength, " ")
            }
            function padGoType(item) {
                let type =  item.goType
                if (type === "custom") {
                    type = item.goTypeCustom
                }
                if (item.isIDTypeAlias) {
                    type = "ID" + vm.model.structName
                }
                return type.padEnd(maxGoTypeLength, " ")
            }
            return ejs.render(code, {
                c: {
                    notSetPrimaryKey: function() {
                        return !v.fields.some(function (item) {
                            return item.isPrimaryKey
                        })
                    },
                    hasAutoIncrement: function () {
                        return v.fields.some(function (item) {
                            return item.isAutoIncrement
                        })
                    },
                    autoIncrementItem: function () {
                        let out = false
                        v.fields.some(function (item) {
                            if (item.isAutoIncrement) {
                                out = item
                                return true
                            }
                        })
                        return out
                    },
                    autoIncrementValueCode: function () {
                        let target = {}
                        v.fields.some(function (item) {
                            if (item.isAutoIncrement) {
                                target = item
                                return true
                            }
                        })
                        let code = "id"
                        code = `${target.goType}(${code})`
                        if (target.isIDTypeAlias) {
                            code = `ID${vm.model.structName}(${code})`
                        }
                        return code
                    },
                    ColumnFieldCreateUpdateTypeCode() {
                        let code = ""
                        switch (vm.model.fieldCreateUpdate) {
                            case "sq.CreatedAtUpdatedAt":
                            code = `CreatedAt sq.Column\n\tUpdatedAt sq.Column`
                            break
                            case "sq.CreateTimeUpdateTime":
                                code = `CreateTime sq.Column\n\tUpdateTime sql.Column`
                                break
                            case "sq.GMTCreateGMTUpdate":
                                code = `GMTCreate sq.Column\n\tGMTUpdate sql.Column`
                                break
                            default:
                        }
                        return code
                    },
                    ColumnFieldCreateUpdateValueCode() {
                        let code = ""
                        switch (vm.model.fieldCreateUpdate) {
                            case "sq.CreatedAtUpdatedAt":
                                code = `col.CreatedAt = "created_at"\n\tcol.UpdatedAt = "updated_at"`
                                break
                            case "sq.CreateTimeUpdateTime":
                                code = `col.CreateTime = "create_time"\n\tcol.UpdateTime = "update_time"`
                                break
                            case "sq.GMTCreateGMTUpdate":
                                code = `col.GMTCreate = "gmt_create"\n\tcol.GMTUpdate = "gmt_update"`
                                break
                            default:
                        }
                        return code
                    }
                },
                v: v,
                h: {
                    strToCamel,
                    strFirstLetterToLowCase,
                    padGoField,
                    padGoType,
                    padGolFieldValue,
                },
            }, {delimiter: "#"})
        },
        modelResultCode () {
            return Prism.highlight(this.modelResult, Prism.languages.go, "go")
        }
    },
    created: function () {
        const vm = this
        setTimeout(function callee () {
            localStorage.setItem(MODEL_KEY, JSON.stringify(vm.model))
            setTimeout(callee, 1000)
        }, 0)
    },
    methods: {
        label(value){
            if (value == "custom") {
                return "自定义"
            }
            return value
        },
        removeFieldsItem(removeIndex) {
            const vm = this
            vm.model.fields = vm.model.fields.filter(function (item, index) {
                return index != removeIndex
            })
        },
        copyCode() {
            const vm = this
            copy(vm.modelResult)
            vm.$message({
                message: '代码已复制到粘贴板',
                type: "success",
            });
        },
        useUserExampleData () {
            const vm = this
            vm.model = { "packageName": "m", "tableName": "user", "structName": "User", "softDelete": "sq.SoftDeletedAt", "customSoftDelete": { "SoftDeleteWhere": "return sq.Raw{\"`deleted_at` IS NULL\", nil}", "SoftDeleteSet": "return sq.Raw{\"`deleted_at` = ?\" ,[]interface{}{time.Now()}}" }, "fieldCreateUpdate": "sq.CreatedAtUpdatedAt", "fields": [ { "isAutoIncrement": true, "isPrimaryKey": true, "isIDTypeAlias": true, "column": "id", "goType": "uint64", "goTypeCustom": "", "goField": "ID" }, { "isAutoIncrement": false, "isPrimaryKey": false, "isIDTypeAlias": false, "column": "name", "goType": "string", "goTypeCustom": "", "goField": "Name" }, { "isAutoIncrement": false, "isPrimaryKey": false, "isIDTypeAlias": false, "column": "password_sha256", "goType": "string", "goTypeCustom": "", "goField": "PasswordSha256" }, { "isAutoIncrement": false, "isPrimaryKey": false, "isIDTypeAlias": false, "column": "password_salt", "goType": "string", "goTypeCustom": "", "goField": "PasswordSalt" } ] }
        },
        blurModelStructName() {
            const vm = this
            vm.model.structName = strToCamel(vm.model.structName)
            if (vm.model.structName == "") return
            vm.model.tableName = strCamelToSnake(vm.model.structName)
        },
        addNewField() {
            const vm = this
            vm.model.fields = vm.model.fields.concat({
                isAutoIncrement: false,
                isPrimaryKey: false,
                isIDTypeAlias: false,
                column: "",
                goType: "",
                goTypeCustom: "",
                goField: "",
            })
        },
        blurGoFieldsItem(index) {
            const vm = this
            let item = vm.model.fields[index]
            let column = strCamelToSnake(item.goField)
            vm.model.fields[index].column = column
        },
        changeSofeDelete () {
            const vm = this
            if (Object.values(vm.model.customSoftDelete).join("").length == 0) {
                vm.model.customSoftDelete = vm.default.customSoftDelete
            }
        },
        changeIsAutoIncrement (row, index) {
            const vm = this
            if (row.isAutoIncrement) {
                let item = vm.model.fields[index]
                item.goType = "uint64"
            }
        },
        resetModel() {
            this.model = defaultModel()
        }
    },
    data: function () {
        let model = defaultModel()
        const moelData = localStorage.getItem(MODEL_KEY)
        if (moelData) {
            try {
                model = JSON.parse(moelData)
            } catch(err) {
                console.log(err)
            }
        }
        return {
            options: {
                softDelete: [
                    'custom',
                    'sq.SoftDeletedAt',
                    'sq.SoftDeleteTime',
                    'sq.SoftIsDeleted',
                    'sq.WithoutSoftDelete',
                ],
                fieldType: [
                    'custom',
                    'bool',
                    'float32',
                    'float64',
                    'string',
                    'uint8',
                    'uint64',
                    'int',
                    'int32',
                    'int64',
                    'sql.NullTime',
                ],
                fieldCreateUpdate: [
                    'sq.CreatedAtUpdatedAt',
                    'sq.CreateTimeUpdateTime',
                    'sq.GMTCreateGMTUpdate',
                    'without',
                ]
            },
            default: {
                customSoftDelete: {
                    SoftDeleteWhere: `return sq.Raw{"\`deleted_at\` IS NULL", nil}`,
                    SoftDeleteSet: `return sq.Raw{"\`deleted_at\` = ?" ,[]interface{}{time.Now()}}`,
                }
            },
            model: model
        }
    }
}
