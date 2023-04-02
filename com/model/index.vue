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
                <el-button size="mini" type="primary" @click="useUserExampleData"
                >user
                </el-button>
            </el-form-item>
            <el-form-item label="package">
                <el-input
                        style="width: 10em"
                        placeholder="eg:user"
                        v-model="model.packageName"
                ></el-input>
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
                            <el-input
                                    v-model="row.column"
                                    @blur="blurColumnItem(index)"
                            ></el-input>
                        </td>
                        <td>
                            <el-select v-model="row.goType" filterable style="width: 10em">
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
                                    placeholder="eg:UserLevel"
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

                            <el-button icon="el-icon-arrow-up" size="mini"></el-button>
                            <el-button icon="el-icon-arrow-down" size="mini"></el-button>
                        </td>
                    </tr>
                </table>

                <el-button @click="addNewField" type="primary" icon="el-icon-plus"
                >添加字段
                </el-button>
            </el-form-item>
        </el-form>

        <div v-for="type in codeType" :key="type">
            <el-button @click="copyFilename(type)">复制 {{ fileName(type) }}</el-button>
            <el-button @click="copyCode(type)">复制代码</el-button>
            <pre class="language-go" v-html="modelResultCode(type)"></pre>
        </div>
    </div>
</template>
<script>
import model from "./model.js";
import ds from "./ds.js";
import ids from "./ids.js";
import * as ejs from "ejs";
import {snakeCase} from "snake-case";
import copy from "copy-to-clipboard";
import dayjs from "dayjs";
import hljs from "highlight.js";
// 引入 hljs 样式
import "highlight.js/styles/github.css";

const components = {};
import h from "./helper.js";

const MODEL_KEY = "goclub_boot_tools_model_v2";
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
        modelResult(type) {
            var tpl = "";
            switch (type) {
                case "model":
                    tpl = model;
                    break;
                case "ds":
                    tpl = ds;
                    break;
                case "ids":
                    tpl = ids;
                    break;
            }
            const vm = this;
            const v = vm.model;
            let maxGoFeildLength = 0;
            let maxGoTypeLength = 0;
            vm.model.fields.forEach(function (item) {
                if (item.goField.length > maxGoFeildLength) {
                    maxGoFeildLength = item.goField.length;
                }
                if (item.goType.length > maxGoTypeLength) {
                    maxGoTypeLength = item.goType.length;
                }
            });
            maxGoFeildLength++;
            maxGoTypeLength++;
            return ejs.render(
                tpl,
                {
                    h: h,
                    c: {
                        subModelName() {
                            if (v.structName != v.interfaceName) {
                                return v.structName.replaceAll(v.interfaceName, '')
                            }
                            return ""
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
                        padGoType: function (item) {
                            let type = item.goType;
                            if (type === "custom") {
                                type = item.goTypeCustom;
                            }
                            if (v.isIDTypeAlias && item.isPrimaryKey) {
                                type = "ID" + vm.model.structName;
                            }
                            return type.padEnd(maxGoTypeLength, " ");
                        },
                        padGoField: function (item) {
                            return item.goField.padEnd(maxGoFeildLength, " ");
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
            var hash = {
                "model": "sql_" + snakeCase(vm.model.tableName) + ".go",
                "ds": "ds.go",
                "ids": "interface/ds.go",
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
        useUserExampleData() {
            const vm = this;
            vm.model = {
                packageName: "m",
                tableName: "user",
                structName: "User",
                softDelete: "sq.SoftDeleteTime",
                isAutoIncrement: true,
                isIDTypeAlias: true,
                customSoftDelete: {
                    SoftDeleteWhere: 'return sq.Raw{"`delete_time` IS NULL", nil}',
                    SoftDeleteSet:
                        'return sq.Raw{"`delete_time` = ?" ,[]interface{}{time.Now()}}',
                },
                fieldCreateUpdate: "sq.CreateTimeUpdateTime",
                fields: [
                    {
                        isPrimaryKey: true,
                        column: "id",
                        goType: "uint64",
                        goField: "ID",
                    },
                    {
                        column: "mobile",
                        goType: "string",
                        goField: "Mobile",
                    },
                ],
            };
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
        blurColumnItem(index) {
            const vm = this;
            let item = vm.model.fields[index];
            let value = item.column;
            if (value == "id") {
                value = "ID";
            }
            value = value.replace(/_id$/, "ID");
            value = strToCamel(value);
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
                    "custom",
                    "bool",
                    "float32",
                    "float64",
                    "string",
                    "[]byte",
                    "uint",
                    "uint8",
                    "uint16",
                    "uint32",
                    "uint64",
                    "int",
                    "int8",
                    "int16",
                    "int32",
                    "int64",
                    "time.Time",
                    "xtime.Date",
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
            codeType: ['model', 'ids', 'ds'],
        };
    },
};
</script>
<style>
.language-go {
    padding: 1em;
    margin-top: 0;
    margin-right: 0.5em;
    height: 20em;
    overflow: auto;
}
</style>
