<template>
    <div>
        <el-form label-width="8em" size="mini">
            <el-form-item label="文档">
                <el-link type="primary" href="https://goclub.run/sql/" target="_blank"
                >goclub/sql
                </el-link>
            </el-form-item>
            <el-form-item label="迁移函数名">
                <el-button @click="copyMigrateName">{{ migrateName }}</el-button>
            </el-form-item>
            <el-form-item label="示例配置">
                <el-button-group>
                    <el-button @click="useExampleData(key)" v-for="(value, key) in exampleDataHash">{{
                        key
                        }}
                    </el-button>
                </el-button-group>
            </el-form-item>
            <el-form-item label="interface">
                <el-input
                        style="width: 10em"
                        placeholder="eg:User"
                        v-model="model.interfaceName"
                ></el-input>
                <span style="opacity: 0.7;padding-left: 0.4em;">I{{ model.interfaceName }}.CreateRequest</span>
            </el-form-item>
            <el-form-item label="name">
                table:
                <el-input
                        style="width: 12em"
                        @blur="blurTableName"
                        v-model="model.tableName"
                ></el-input>
                struct:
                <el-input
                        style="width: 12em"
                        placeholder="eg:User"
                        v-model="model.structName"
                ></el-input>
            </el-form-item>
            <el-form-item label="sign mame">
                <el-input
                        style="width: 30em"
                        :placeholder="'非必填,默认值:' + model.structName.replaceAll(model.interfaceName, '')"
                        v-model="model.signName"
                ></el-input>
            </el-form-item>
            <el-form-item label="Source" v-if="q.debug">
                <el-input type="textarea" :value="JSON.stringify(model,false, '    ')"></el-input>
            </el-form-item>
            <el-form-item label="软删">
                <el-select v-model="model.softDelete" @change="changeSofeDelete">
                    <el-option
                            v-for="item in options.softDelete"
                            :key="item"
                            :label="label(item)"
                            :value="item"
                    ></el-option>
                </el-select>
                <div
                        v-if="model.softDelete == 'custom'"
                        style="padding-left: 2em; opacity: 0.8"
                >
                    SoftDeleteWhere:
                    <br/>
                    <el-input
                            style="width: 30em"
                            v-model="model.customSoftDelete.SoftDeleteWhere"
                    />
                    <br/>
                    SoftDeleteSet:
                    <br/>
                    <el-input
                            style="width: 30em"
                            v-model="model.customSoftDelete.SoftDeleteSet"
                    />
                </div>
            </el-form-item>
            <el-form-item label="创建/更新时间">
                <el-select v-model="model.fieldCreateUpdate" style="width: 15em">
                    <el-option
                            v-for="item in options.fieldCreateUpdate"
                            :key="item"
                            :label="label(item)"
                            :value="item"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="主键配置">
                递增:
                <el-switch v-model="model.isAutoIncrement"></el-switch>
                ID类型别名:
                <el-switch v-model="model.isIDTypeAlias"></el-switch>
            </el-form-item>
            <el-form-item label="字段">
                <table style="width: 100%">
                    <thead>
                    <tr>
                        <th>主键</th>
                        <th>创建</th>
                        <th>更新</th>
                        <th>分页Req</th>
                        <th>分页Reply</th>
                        <th>SQL column</th>
                        <th>Go Type</th>
                        <th>Go Field</th>
                        <th>注释</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tr v-for="(row, index) in model.fields">
                        <td>
                            <el-switch v-model="row.isPrimaryKey"></el-switch>
                        </td>
                        <td>
                            <el-switch v-model="row.isCreate"></el-switch>
                        </td>
                        <td>
                            <el-switch v-model="row.isUpdate"></el-switch>
                        </td>
                        <td>
                            <el-switch v-model="row.pagingReq"></el-switch>
                        </td>
                        <td>
                            <el-switch v-model="row.pagingReply"></el-switch>
                        </td>
                        <td>
                            <el-input
                                    v-model="row.column"
                                    @blur="blurColumnItem(index)"
                            ></el-input>
                        </td>
                        <td>
                            <el-select v-model="row.goType" filterable style="width: 10em"
                                       @change="changeGoType(index)">
                                <el-option
                                        v-for="item in options.fieldType"
                                        :key="item"
                                        :label="label(item)"
                                        :value="item"
                                ></el-option>
                            </el-select>
                            <el-input
                                    v-if="row.goType == 'custom'"
                                    style="width: 12em"
                                    placeholder="eg:PlatformKind"
                                    v-model="row.goTypeCustom"
                            ></el-input>
                        </td>
                        <td>
                            <el-input v-model="row.goField"></el-input>
                        </td>
                        <td>
                            <el-input
                                    type="textarea"
                                    style="width: 100px"
                                    autosize
                                    v-model="row.comment"
                            ></el-input>
                        </td>
                        <td>
                            <el-button
                                    @click="removeFieldsItem(index)"
                                    size="mini"
                                    type="danger"
                                    icon="el-icon-remove"
                            ></el-button>

                            <el-button icon="el-icon-arrow-up" size="mini"
                                       @click="swapIndex($event, index, 'up')"></el-button>
                            <el-button icon="el-icon-arrow-down" size="mini"
                                       @click="swapIndex($event, index, 'down')"></el-button>
                        </td>
                    </tr>
                </table>

                <el-button @click="addNewField" type="primary" icon="el-icon-plus"
                >添加字段
                </el-button>
            </el-form-item>
        </el-form>
        <el-tabs v-model="codeTypeTab">
            <el-tab-pane v-for="type in codeType" :key="type"
                         :label="fileName(type)" :name="type">
                <el-button @click="copyFilename(type)" type="primary">复制文件名</el-button>
                <el-button @click="copyCode(type)" type="primary">复制代码</el-button>
                <!--                <div v-if="codeTypeTab === 'ds' || codeTypeTab === 'ids'">-->
                <!--                    <br>-->
                <!--                    新接口:-->
                <!--                    <el-switch v-model="model.isNewInteface"></el-switch>-->
                <!--                </div>-->
                <pre class="language-go" v-html="modelResultCode(type)"></pre>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import exampleDataHash from "./exampleDataHash.js";
import model from "./model.js";
import ds from "./ds.js";
import ids from "./ids.js";
import base from "./base.js";
import ibase from "./ibase.js";
import * as ejs from "ejs";
import {snakeCase} from "snake-case";
import copy from "copy-to-clipboard";
import dayjs from "dayjs";
import hljs from "highlight.js";
import "highlight.js/lib/languages/go.js";
import "highlight.js/styles/base16/solarized-light.css";

const components = {};
import h from "./helper.js";
import * as querystring from "querystring";

const MODEL_KEY = "goclub.run/model/v3";
const defaultModel = function () {
    return {
        isNewInteface: true,
        packageName: "m",
        tableName: "",
        structName: "",
        signName: "",
        softDelete: "",
        customSoftDelete: {
            SoftDeleteWhere: ``,
            SoftDeleteSet: ``,
        },
        fieldCreateUpdate: "",
        fields: [],
    };
};
export default {
    name: "spec-model",
    components,
    computed: {},

    created: function () {
        const vm = this;
        setTimeout(function callee() {
            localStorage.setItem(MODEL_KEY, JSON.stringify(vm.model));
            setTimeout(callee, 1000);
        }, 0);
    },
    methods: {
        useExampleData(key) {
            this.model = JSON.parse(JSON.stringify(this.exampleDataHash[key]))
        },
        // 基于index 和 kind(up down) 调整 vm.model[index]的位置
        swapIndex(event, index, kind) {
            const vm = this;
            const fields = vm.model.fields;
            const length = fields.length;
            if (index === 0 && kind === 'up') {
                return;
            }
            if (index === length - 1 && kind === 'down') {
                return;
            }
            let newIndex = 0;
            if (kind === 'up') {
                newIndex = index - 1;
            }
            if (kind === 'down') {
                newIndex = index + 1;
            }
            const temp = fields[index];
            fields[index] = fields[newIndex];
            fields[newIndex] = temp;
            vm.model.fields = fields
            vm.$forceUpdate()
            switch (kind) {
                case 'up':
                    window.scrollBy(0, -(event.target.offsetHeight + 5));
                    break;
                case 'down':
                    window.scrollBy(0, (event.target.offsetHeight + 5));
                    break;
            }
        },
        modelResult(type) {
            var tpl = "";
            switch (type) {
                case "model":
                    tpl = model;
                    break;
                case 'ibase':
                    tpl = ibase;
                    break
                case 'base':
                    tpl = base;
                    break
                case "ds":
                    tpl = ds;
                    break;
                case "ids":
                    tpl = ids;
                    break;
            }
            const vm = this;
            const v = vm.model;
            let maxGoFieldLength = 0;
            let maxGoTypeLength = 0;
            vm.model.fields.forEach(function (item) {
                if (item.goField.length > maxGoFieldLength) {
                    maxGoFieldLength = item.goField.length;
                }
                if (item.goType.length > maxGoTypeLength) {
                    maxGoTypeLength = item.goType.length;
                }
            });
            maxGoFieldLength++;
            maxGoTypeLength++;
            return ejs.render(
                tpl,
                {
                    h: h,
                    c: {
                        SQIFCode(item) {
                            console.log(item.goType)
                            switch (item.goType) {
                                case "string":
                                    return `${item.goField} != ""`
                                    break
                                // 下面代码有什么错误?类型有漏掉什么吗
                                case "int":
                                case "int8":
                                case "int16":
                                case "int32":
                                case "int64":
                                case "uint":
                                case "uint8":
                                case "uint16":
                                case "uint32":
                                case "uint64":
                                case "float32":
                                case "float64":
                                    return `${item.goField} != 0`
                                    break
                                default:

                                    // slice
                                function hasPrefix(str, prefix) {
                                    return item.goType.slice(0, prefix.length) === prefix;
                                }

                                    if (hasPrefix(item.goType, "[]")) {
                                        return `len(${item.goField}) != 0`
                                    }
                                    if (hasPrefix(item.goType, "*")) {
                                        return `len(${item.goField}) != nil`
                                    }
                                    return `!${item.goField}.IsZero()`
                            }
                        },
                        needUpdate() {
                            var need = v.fields.some(function (item) {
                                return item.isUpdate
                            })
                            return need
                        },
                        needPaging() {
                            var need = v.fields.some(function (item) {
                                if (item.pagingReq) {
                                    return true
                                }
                                if (item.pagingReply) {
                                    return true
                                }
                                return false
                            })
                            return need
                        },
                        primaryKeyGoSQLWhereCode(indent, prefix) {
                            prefix = prefix || ""
                            if (!indent) {
                                indent = 2
                            }
                            return `sq.` + v.fields.filter(function (v) {
                                return v.isPrimaryKey;
                            }).map(function (v) {
                                var goType = v.goType
                                if (goType === "custom") {
                                    goType = v.goTypeCustom
                                }
                                var field = v.goField
                                if (!prefix) {
                                    field = h.firstLow(field)
                                }
                                return `\n${h.indent(indent)}And(col.${v.goField}, sq.Equal(${prefix}${field})).`
                            }).join("").replace(/\.$/, '') + ""
                        },
                        primaryKeyGoVar(isSlice) {
                            return v.fields.filter(function (v) {
                                return v.isPrimaryKey;
                            }).map(function (v) {
                                return h.firstLow(v.goField)
                            }).join(", ")
                        },
                        primaryKeyGoVarType() {
                            return v.fields.filter(function (v) {
                                return v.isPrimaryKey;
                            }).map(function (v) {
                                var goType = v.goType
                                if (goType === "custom") {
                                    goType = v.goTypeCustom
                                }
                                if (v.isPrimaryKey && vm.model.isIDTypeAlias) {
                                    goType = "m.ID" + vm.model.structName
                                }
                                return h.firstLow(v.goField) + " " + goType
                            }).join(", ")
                        },
                        primaryKeyGoStructFieldType() {
                            return h.indent() + v.fields.filter(function (v) {
                                return v.isPrimaryKey;
                            }).map(function (v) {
                                var goType = v.goType
                                if (goType === "custom") {
                                    goType = v.goTypeCustom
                                }
                                return v.goField + " " + goType
                            }).join("\n" + h.indent())
                        },
                        signName(d) {
                            d = d || ""
                            if (v.signName) {
                                return v.signName
                            }
                            if (v.structName !== v.interfaceName) {
                                return v.structName.replaceAll(v.interfaceName, '')
                            }
                            return d
                        },

                        // 要创建的字段
                        createFields: function () {
                            return v.fields.filter(function (v) {
                                return v.isCreate;
                            });
                        },
                        updateFields: function () {
                            return v.fields.filter(function (v) {
                                return v.isUpdate;
                            });
                        },
                        pagingReqFields: function () {
                            return v.fields.filter(function (v) {
                                return v.pagingReq;
                            });
                        },
                        pagingReplyFields: function () {
                            return v.fields.filter(function (v) {
                                return v.pagingReply;
                            });
                        },
                        columnFieldCreateUpdateValueCode() {
                            let code = "";
                            switch (vm.model.fieldCreateUpdate) {
                                case "sq.CreatedAtUpdatedAt":
                                    code = `col.CreatedAt = "created_at"\n    col.UpdatedAt = "updated_at"`;
                                    break;
                                case "sq.CreateTimeUpdateTime":
                                    code = `col.CreateTime = "create_time"\n    col.UpdateTime = "update_time"`;
                                    break;
                                case "sq.GMTCreateGMTUpdate":
                                    code = `col.GMTCreate = "gmt_create"\n    col.GMTUpdate = "gmt_update"`;
                                    break;
                                default:
                            }
                            return code;
                        },
                        columnFieldCreateUpdateTypeCode() {
                            let code = "";
                            switch (vm.model.fieldCreateUpdate) {
                                case "sq.CreatedAtUpdatedAt":
                                    code = `CreatedAt sq.Column\n    UpdatedAt sq.Column`;
                                    break;
                                case "sq.CreateTimeUpdateTime":
                                    code = `CreateTime sq.Column\n    UpdateTime sq.Column`;
                                    break;
                                case "sq.GMTCreateGMTUpdate":
                                    code = `GMTCreate sq.Column\n    GMTUpdate sq.Column`;
                                    break;
                                default:
                            }
                            return code;
                        },
                        autoIncrementValueCode: function () {
                            let target = {};
                            v.fields.some(function (item) {
                                if (item.isPrimaryKey) {
                                    target = item;
                                    return true;
                                }
                            });
                            let code = "id";
                            if (target.goType != "uint64") {
                                code = `${target.goType}(${code})`;
                            }
                            if (v.isIDTypeAlias) {
                                code = `ID${vm.model.structName}(${code})`;
                            }
                            return code;
                        },
                        autoIncrementItem: function () {
                            let out = false;
                            v.fields.some(function (item) {
                                if (item.isPrimaryKey) {
                                    out = item;
                                    return true;
                                }
                            });
                            return out;
                        },
                        sqTag(item) {
                            var tagItems = [];
                            if (item.isPrimaryKey && v.isAutoIncrement) {
                                tagItems.push("ignoreInsert");
                            }
                            if (tagItems.length == 0) {
                                return "";
                            }
                            return ` sq:"${tagItems.join("|")}"`;
                        },
                        padGoType: function (item, prefix) {
                            prefix = prefix || ""
                            let type = item.goType;
                            if (type === "custom") {
                                type = `${prefix}` + item.goTypeCustom || '';
                            }
                            if (v.isIDTypeAlias && item.isPrimaryKey) {
                                type = `${prefix}` + "ID" + vm.model.structName;
                            }
                            return type.padEnd(maxGoTypeLength, " ");
                        },
                        padGoField: function (item) {
                            return item.goField.padEnd(maxGoFieldLength, " ");
                        },
                        primaryKey: function () {
                            var target = null;
                            v.fields.some(function (item) {
                                if (item.isPrimaryKey) {
                                    target = item;
                                    return true;
                                }
                            });
                            return target;
                        },
                    },
                    v: v,
                },
                {delimiter: "#"}
            );
        },
        modelResultCode(type) {
            // 返回代码高亮后的代码
            // 返回代码高亮
            const vm = this;
            const code = vm.modelResult(type);
            // 返回代码高亮
            const result = hljs.highlight("go", code);
            return result.value;
        },
        copyMigrateName() {
            const vm = this;
            copy(vm.migrateName);
            vm.$message({
                message: "迁移函数名已复制到粘贴板",
                type: "success",
            });
        },
        label(value) {
            var hash = {
                custom: "自定义",
                "sq.SoftDeleteTime": "delete_time` IS NULL",
                "sq.SoftDeletedAt": "deleted_at` IS NULL",
                "sq.SoftIsDeleted": "is_deleted` = 0",
                "sq.WithoutSoftDelete": "无",
                "sq.CreateTimeUpdateTime": "create_time update_time",
                "sq.CreatedAtUpdatedAt": "created_at updated_at",
                "sq.GMTCreateGMTUpdate": "gmt_create gmt_modified",
            };
            if (hash[value]) {
                return hash[value];
            }
            return value;
        },
        removeFieldsItem(removeIndex) {
            const vm = this;
            vm.model.fields = vm.model.fields.filter(function (item, index) {
                return index != removeIndex;
            });
        },
        fileName(type) {
            const vm = this;
            var name = snakeCase(vm.model.tableName)
            var hash = {
                'ibase': 'inteface/ds.go',
                'base': 'ds.go',
                "model": "../1model/sql_" + name + ".go",
                "ds": "ds_" + name + ".go",
                "ids": "interface/ds_" + name + ".go",
            }
            return hash[type]
        },
        copyFilename(type) {
            const vm = this;
            copy(vm.fileName(type));
            vm.$message({
                message: "文件名已复制到粘贴板",
                type: "success",
            });
        },
        copyCode(type) {
            const vm = this;
            copy(vm.modelResult(type));
            vm.$message({
                message: "代码已复制到粘贴板",
                type: "success",
            });
        },
        blurTableName() {
            const vm = this;
            vm.model.structName = h.toCamel(vm.model.tableName);
        },
        addNewField() {
            const vm = this;
            vm.model.fields = vm.model.fields.concat({
                isPrimaryKey: false,
                column: "",
                goType: "",
                goField: "",
            });
        },
        changeGoType(index) {
            const vm = this;
            let item = vm.model.fields[index];
            if (item.goType == "custom") {
                if (item.goTypeCustom == "") {
                    item.goTypeCustom = vm.model.structName + item.goField
                }
            }
        },
        blurColumnItem(index) {
            const vm = this;
            let item = vm.model.fields[index];
            let value = item.column;
            if (value == "id") {
                value = "ID";
            }
            value = value.replace(/_id$/, "ID");
            value = h.toCamel(value);
            vm.model.fields[index].goField = value;
        },
        blurGoFieldsItem(index) {
            const vm = this;
            let item = vm.model.fields[index];
            let column = strCamelToSnake(item.goField);
            vm.model.fields[index].column = column;
        },
        changeSofeDelete() {
            const vm = this;
            if (Object.values(vm.model.customSoftDelete).join("").length == 0) {
                vm.model.customSoftDelete = vm.default.customSoftDelete;
            }
        },
    },
    data: function () {
        let model = defaultModel();
        const moelData = localStorage.getItem(MODEL_KEY);
        if (moelData) {
            try {
                model = JSON.parse(moelData);
            } catch (err) {
                console.log(err);
            }
        }
        return {
            q: querystring.parse(location.search.slice(1)),
            exampleDataHash: exampleDataHash,
            migrateName: "Migrate_" + dayjs().format("YYYY_MM_DD__hh_mm") + "_",
            options: {
                softDelete: [
                    "custom",
                    "sq.SoftDeletedAt",
                    "sq.SoftDeleteTime",
                    "sq.SoftIsDeleted",
                    "sq.WithoutSoftDelete",
                ],
                fieldType: [
                    "string",
                    "uint64",
                    "time.Time",
                    "xtime.Date",
                    "custom",
                    "bool",
                    "float32",
                    "float64",
                    "[]byte",
                    "uint",
                    "uint8",
                    "uint16",
                    "uint32",
                    "int",
                    "int8",
                    "int16",
                    "int32",
                    "int64",
                    "sql.NullString",
                    "sql.NullInt16",
                    "sql.NullInt32",
                    "sql.NullInt64",
                    "sql.NullBool",
                    "sql.NullFloat64",
                    "sql.NullTime",
                    "xtime.NullDate",
                ],
                fieldCreateUpdate: [
                    "sq.CreateTimeUpdateTime",
                    "sq.CreatedAtUpdatedAt",
                    "sq.GMTCreateGMTUpdate",
                    "无",
                ],
            },
            default: {
                customSoftDelete: {
                    SoftDeleteWhere: `return sq.Raw{"\`deleted_at\` IS NULL", nil}`,
                    SoftDeleteSet: `return sq.Raw{"\`deleted_at\` = ?" ,[]interface{}{time.Now()}}`,
                },
            },
            model: model,
            codeType: ['model', 'ibase', 'ids', 'base', 'ds'],
            codeTypeTab: 'model',
        };
    },
};
</script>
<style>
.language-go {
    padding: 0 0.5em;
    overflow: auto;
    background: #fdf6e3;
    border-radius: 0.3em;
    tab-size: 2;
}

</style>
