<template>
    <div>
        <el-form label-width="6em" size="mini">
            <el-form-item label="">
                goclub/sql 根据表单生成 CRUD 代码,跟简单重复的工作说永别.
            </el-form-item>
            <el-form-item label="参考">
                <el-button @click="setDefaultModel">清空</el-button>&nbsp;
                <el-button-group>
                    <el-button @click="useExampleData(key)" v-for="(value, key) in exampleDataHash" :key="key">{{
                        key
                        }}
                    </el-button>
                </el-button-group>
                &nbsp;<el-link type="primary" href="https://goclub.run/sql/" target="_blank">文档</el-link>
            </el-form-item>
            <el-form-item label="表名">
                <el-input
                        style="width: 12em"
                        @blur="blurTableName"
                        placeholder="SQL表名"
                        v-model="model.tableName"
                ></el-input>
                <span v-if="model.tableName != ''">
                    sq.Model
                    <el-input
                            style="width: 12em"
                            v-model="model.structName"
                    ></el-input>
                    包名
                    <el-input
                            style="width: 10em"
                            v-model="model.interfaceName"
                    ></el-input>
                    签名
                    <el-input
                            style="width: 10em"
                            v-model="model.signName"
                            @blur="blurSignName"
                    ></el-input>
                </span>
                <div v-if="model.tableName != ''">
                    <pre class="language-go bit-exmaple-code" v-html="bitExampleCode()"></pre>
                </div>
            </el-form-item>
            <el-form-item label="Source" v-if="q.debug">
                <el-input type="textarea" :value="JSON.stringify(model,false, '    ')"></el-input>
            </el-form-item>
            <el-form-item label="软删" v-if="model.tableName != ''">
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
            <el-form-item label="主键" v-if="hasPrimaryKey">
                递增
                <el-switch v-model="model.isAutoIncrement"></el-switch>
                类型别名
                <el-popover placement="top" trigger="hover">
                    <code style="padding:0 5px;font-size: 12px;">
                        type {{ model.structName }} struct {
                        {{
                        modelData().c.primaryKey().goField || "ID"
                        }}
                        <span v-if="model.isIDTypeAlias">ID{{ model.structName }}</span>
                        <span v-else>{{
                            modelData().c.primaryKey().goType
                            }}</span>
                        }
                    </code>
                    <el-switch slot="reference" v-model="model.isIDTypeAlias"></el-switch>
                </el-popover>

            </el-form-item>
            <el-form-item label="字段">
                <div class="fields">
                    <table style="width: 100%">
                        <thead>
                        <tr>
                            <th style="width: 40px">主键

                            </th>
                            <th style="width: 40px">
                                <el-popover placement="top" trigger="hover">
                                    Create 请求参数
                                    <span slot="reference">创建<i style="color:#909399;"
                                                                  class="el-icon-question"></i></span>
                                </el-popover>
                            </th>
                            <th style="width: 40px">
                                <el-popover placement="top" trigger="hover">
                                    Update 请求参数
                                    <span slot="reference">更新<i style="color:#909399;"
                                                                  class="el-icon-question"></i></span>
                                </el-popover>
                            </th>
                            <th style="width: 40px">
                                <el-popover placement="top" trigger="hover">
                                    Paging 请求参数
                                    <span slot="reference">请求<i style="color:#909399;"
                                                                  class="el-icon-question"></i></span>
                                </el-popover>
                            </th>
                            <th style="width: 40px">
                                <el-popover placement="top" trigger="hover">
                                    Paging 响应数据
                                    <span slot="reference">响应<i style="color:#909399;"
                                                                  class="el-icon-question"></i></span>
                                </el-popover>
                            </th>
                            <th style="width: 40px">
                                <el-popover placement="top" trigger="hover">
                                    角色鉴权字段
                                    <span slot="reference">鉴权<i style="color:#909399;"
                                                                  class="el-icon-question"></i></span>
                                </el-popover>
                            </th>
                            <th style="width: 150px">Table Field</th>
                            <th style="width: 150px">Go Type</th>
                            <th style="width: 100px">Go Field</th>
                            <th style="width: 100px">Label</th>
                            <th style="text-align: left;">操作</th>
                        </tr>
                        </thead>
                        <tr v-for="(row, index) in model.fields">
                            <td>
                                <el-switch size="mini" v-model="row.isPrimaryKey"></el-switch>
                            </td>
                            <td>
                                <el-switch size="mini" v-model="row.isCreate"></el-switch>
                            </td>
                            <td>
                                <el-switch size="mini" v-model="row.isUpdate"></el-switch>
                            </td>
                            <td>
                                <el-switch size="mini" v-model="row.pagingReq"></el-switch>
                            </td>
                            <td>
                                <el-switch size="mini" v-model="row.pagingReply"></el-switch>
                            </td>
                            <td>
                                <el-switch :disabled="row.isPrimaryKey" size="mini" @change="changeAuth($event, index)"
                                           v-model="row.isAuth"></el-switch>
                            </td>
                            <td>
                                <el-input
                                        size="mini"
                                        v-model="row.column"
                                        @blur="blurColumnItem(index)"
                                ></el-input>
                            </td>
                            <td>
                                <el-select size="mini"
                                           v-if="row.goType !== 'custom'"
                                           v-model="row.goType" filterable style="display: inline-block;"
                                           @change="changeGoType(index)">
                                    <el-option
                                            v-for="item in options.fieldType"
                                            :key="item"
                                            :label="label(item)"
                                            :value="item"
                                    ></el-option>
                                </el-select>
                                <el-input
                                        size="mini"
                                        v-if="row.goType == 'custom'"
                                        placeholder="eg:PlatformKind"
                                        v-model="row.goTypeCustom"
                                >
                                    <el-button @click="row.goType = 'string'" slot="append"
                                               icon="el-icon-delete"></el-button>
                                </el-input>
                            </td>
                            <td>
                                <el-input size="mini" v-model="row.goField"></el-input>
                            </td>
                            <td>
                                <el-input
                                        size="mini"
                                        v-model="row.label"
                                        placeholder="非必填"
                                ></el-input>
                            </td>
                            <td>
                                <el-button-group>
                                    <el-button
                                            @click="removeFieldsItem(index)"
                                            size="mini"
                                            icon="el-icon-delete"
                                    ></el-button>
                                    <el-button icon="el-icon-arrow-up" size="mini"
                                               @click="swapIndex($event, index, 'up')"></el-button>
                                    <el-button icon="el-icon-arrow-down" size="mini"
                                               @click="swapIndex($event, index, 'down')"></el-button>
                                </el-button-group>
                            </td>
                        </tr>
                    </table>
                    <el-button @click="addNewField" type="primary" icon="el-icon-plus" style="margin-right: 1em;"
                    >添加字段
                    </el-button>
                    <el-dropdown @command="addTemplateField">
                        <el-button type="">
                            添加常用字段<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item
                                    v-for="(item, key) in options.templateField"
                                    :key="key"
                                    :command="key"
                            >{{ key }}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </el-form-item>
        </el-form>
        <el-row>
            <el-col :span="4">

            </el-col>
            <el-col :span="20">
            </el-col>
        </el-row>
        <div class="codeWindow">
            <div class="codeWindowHead">
                <strong>{{ fileTitle(codeTypeTab) }}</strong>: {{ fileName(codeTypeTab) }}
            </div>
            <el-row>
                <el-col :span="4">
                    <el-button @click="copyAllCreateFile" style="width: 100%;border-radius: 0;" type="primary"
                               size="mini">
                        创建所有文件
                    </el-button>
                    <div class="fileList">
                        <el-tree
                                :data="fileList()"
                                :expand-on-click-node="false"
                                :default-expand-all="true"
                        >
                                  <span slot-scope="{ node, data }">
                                       <span v-if="data.children">{{ data.label }}</span>
                                    <el-link type="primary" v-else-if="data.key == fileName(codeTypeTab)">{{
                                        data.label
                                        }}</el-link>
                                    <el-link :alt="fileTitle(mapFileCode(data.key))"
                                             @click="codeTypeTab = mapFileCode(data.value)"
                                             v-else>{{ data.label }}</el-link>
                                  </span>
                        </el-tree>
                        模型目录:
                        <el-input size="mini" :placeholder="defaultDir().sql" v-model="model.dir.sql"></el-input>
                        模块目录:
                        <el-input size="mini" :placeholder="defaultDir().module" v-model="model.dir.module"></el-input>
                        模版目录:
                        <el-input size="mini" :placeholder="defaultDir().tpl" v-model="model.dir.tpl"></el-input>
                        路由目录:
                        <el-input size="mini" :placeholder="defaultDir().handle" v-model="model.dir.handle"></el-input>
                        驼峰ID:
                        <el-select @change="changeCodeStyleCamelCaseID" v-model="model.codeStyle.camelCaseID"
                                   size="mini">
                            <el-option
                                    v-for="item in options.camelCaseID"
                                    :key="item"
                                    :label="item"
                                    :value="item"
                            ></el-option>
                        </el-select>
                    </div>
                </el-col>
                <el-col :span="20">
                    <div class="codeWindowTool">
                        <el-button @click="copyCreateFile(codeTypeTab)" size="mini" type="text">创建当前文件
                        </el-button>
                        <el-divider :underline="false" direction="vertical"></el-divider>
                        <el-button :underline="false" @click="copyFilename(codeTypeTab)" type="text" size="mini">
                            复制文件名
                        </el-button>
                        <el-divider direction="vertical"></el-divider>
                        <el-button :underline="false" @click="copyCode(codeTypeTab)" type="text" size="mini">
                            复制代码
                        </el-button>
                    </div>
                    <pre class="language-go" v-html="modelResultCode(codeTypeTab)"></pre>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
import exampleDataHash from "./exampleDataHash.js";
import extend from "safe-extend"
import modelTPL from "./code/model.js";
import dsTPL from "./code/ds.js";
import idsTPL from "./code/ids.js";
import baseTPL from "./code/base.js";
import ibaseTPL from "./code/ibase.js";
import handleTPL from "./code/handle.js";
import pagingHTMLTPL from "./code/paging_html.js"
import viewTPL from "./code/view.js";
import * as ejs from "ejs";
import {snakeCase} from "snake-case";
import copy from "copy-to-clipboard";
import dayjs from "dayjs";
import formatFilesWithHierarchy from "./formatfilelist"
import hljs from "highlight.js";
import "highlight.js/lib/languages/go.js";
import "highlight.js/styles/base16/solarized-light.css";

const components = {};
import h from "./helper.js";
import * as querystring from "querystring";

const MODEL_KEY = "goclub.run/model/v4";
const defaultModel = function () {
    return {
        packageName: "m",
        tableName: "",
        structName: "",
        signName: "",
        interfaceName: "",
        isAutoIncrement: true,
        isIDTypeAlias: true,
        dir: {
            sql: "",
            module: "",
            tpl: "",
            handle: "",
            view: "",
        },
        softDelete: "sq.WithoutSoftDelete",
        codeStyle: {
            camelCaseID: "ID",
        },
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
    computed: {
        hasPrimaryKey: function () {
            return this.model.fields.some(function (item) {
                return item.isPrimaryKey
            })
        },
    },

    created: function () {
        const vm = this;
        setTimeout(function callee() {
            localStorage.setItem(MODEL_KEY, JSON.stringify(vm.model));
            setTimeout(callee, 1000);
        }, 0);
    },
    methods: {
        changeAuth: function (e, i) {
            if (e === true) {
                this.model.fields = this.model.fields.map(function (v, index) {
                    v.isAuth = index === i
                    return v
                })
            }
        },
        changeCodeStyleCamelCaseID: function () {
            const vm = this
            vm.model.fields.forEach(function (v, i) {
                vm.blurColumnItem(i)
            })
        },
        addTemplateField: function (cmd) {
            this.model.fields = this.model.fields.concat(this.options.templateField[cmd])
        },
        setDefaultModel: function () {
            var codeStyle = this.model.codeStyle
            this.model = defaultModel()
            this.model.codeStyle = codeStyle
        },
        bitExampleCode: function () {
            var v = this.model
            var code = `package ${v.interfaceName}` +
                `\nfunc (dep DS) Must${this.modelData().c.signName()}(ctx context.Context) (model m.${v.structName}, err error) {`
            return hljs.highlight("go", code).value
        },
        clickTreeCode: function (node, e) {
            if (node.children) {
                return
            }
            this.codeTypeTab = this.mapFileCode(node.value)
            this.treeKey = node.key
            return
        },
        mapFileCode: function (k) {
            const vm = this
            var map = {}
            vm.codeType.some(function (type) {
                map[vm.fileName(type)] = type
            })
            return map[k]
        },
        fileList: function () {
            const vm = this
            return formatFilesWithHierarchy(vm.codeType.map(function (item) {
                return vm.fileName(item)
            }))
        },
        blurSignName() {
            this.model.signName = h.toCamel(this.model.signName)
        },
        useExampleData(key) {
            this.model = extend(true, defaultModel(), JSON.parse(JSON.stringify(this.exampleDataHash[key])))
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
        modelData(kind) {
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
            var snakeToCamel = function (str) {
                var out = h.toCamel(
                    str.replace(/([-_][a-z])/g, function (group) {
                        return group.toUpperCase().replace("-", "").replace("_", "");
                    })
                )
                if (v.codeStyle.camelCaseID === "ID") {
                    return out = out.replace(/Id$/, "ID")
                }
                return out;
            }
            var c = {
                AuthFieldSign() {
                    var sign = ""
                    v.fields.some(function (item) {
                        if (item.isAuth) {
                            sign = item.goField.replace(/id$/, '').replace(/ID$/, '')
                            return true
                        }
                    })
                    return sign
                },
                label(item) {
                    if (item.label) {
                        return item.label
                    }
                    return h.firstLow(snakeToCamel(item.column))
                },
                snakeToCamel: snakeToCamel,
                isAutoIncrement() {
                    if (v.isAutoIncrement) {
                        return v.fields.some(function (item) {
                            if (item.isPrimaryKey && item.goType.includes("int")) {
                                return true
                            }
                            return false
                        })
                    }
                    return false
                },
                SQIFCode(item) {
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
                            return `${item.goField}.IsZero()`
                    }
                },
                needCreate() {
                    var need = v.fields.some(function (item) {
                        return item.isCreate
                    })
                    return need
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
                primaryKeyGoVar() {
                    return v.fields.filter(function (v) {
                        return v.isPrimaryKey;
                    }).map(function (v) {
                        return h.firstLow(v.goField)
                    }).join(", ")
                },
                primaryKeyGoField() {
                    return v.fields.filter(function (v) {
                        return v.isPrimaryKey;
                    }).map(function (v) {
                        return v.goField
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
                        return v.goField + " " + goType + " " + `\`json:"${h.firstLow(c.snakeToCamel(v.column))}"\``
                    }).join("\n" + h.indent())
                },
                signName() {
                    return v.signName
                },
                authField: function () {
                    var out = v.fields.filter(function (v) {
                        return v.isAuth;
                    });
                    if (out.length === 0) {
                        return false
                    }
                    return out[0]
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
                    }).sort(function (a, b) {
                        return a.isAuth ? -1 : 1
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
                        case "sq.GMTCreateGMTModified":
                            code = `col.GMTCreate = "gmt_create"\n    col.GMTModified = "gmt_update"`;
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
                        case "sq.GMTCreateGMTModified":
                            code = `GMTCreate sq.Column\n    GMTModified sq.Column`;
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
                goFieldIsZero(item, prefix) {
                    var field = h.firstLow(item.goField)
                    switch (item.goType) {
                        case 'custom':
                            return field + ".IsZero()"
                            break
                        case 'string':
                        case '[]byte':
                        case '[]rune':
                        case '[]int8':
                            return `len(${field}) == 0`
                            break
                        default:
                            return `${field} == 0`
                    }
                },
                goType: function (item, prefix) {
                    prefix = prefix || ""
                    let type = item.goType;
                    if (type === "custom") {
                        if (item.goTypeCustom.indexOf('.') != -1) {
                            prefix = ""
                        }
                        type = `${prefix}` + item.goTypeCustom || '';
                    }
                    if (v.isIDTypeAlias && item.isPrimaryKey) {
                        type = `${prefix}` + "ID" + vm.model.structName;
                    }
                    return type
                },
                padGoType: function (item, prefix) {
                    return this.goType(item, prefix).padEnd(maxGoTypeLength, " ");
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
            }
            var data = {
                h: h,
                c: c,
                v: v,
            }
            if (kind === "onlySignName") {
                return c.signName()
            }
            return data
        },
        modelResult(type, kind) {
            var tpl = "";
            var hash = {
                'model': modelTPL,
                'ibase': ibaseTPL,
                'base': baseTPL,
                'ds': dsTPL,
                'ids': idsTPL,
                "paging.html": pagingHTMLTPL,
                'view': viewTPL,
                'handle': handleTPL,

            }
            tpl = hash[type]
            var data = this.modelData(kind)
            return ejs.render(
                tpl,
                data,
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
                "sq.SoftDeleteTime": "delete_time IS NULL",
                "sq.SoftDeletedAt": "deleted_at IS NULL",
                "sq.SoftIsDeleted": "is_deleted = 0",
                custom: "自定义",
                "sq.WithoutSoftDelete": "无",
                "sq.CreateTimeUpdateTime": "create_time update_time",
                "sq.CreatedAtUpdatedAt": "created_at updated_at",
                "sq.GMTCreateGMTModified": "gmt_create gmt_modified",
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
        defaultDir() {
            return {
                "sql": "1model",
                "module": `${h.firstLow(this.model.interfaceName)}`,
                "tpl": "tpl",
                "handle": "1http",
                "view": "view/admin",
            }
        },
        defaultTableDir() {
            return "1model"
        },
        defaultModuleDir() {
            const vm = this;
            return `${h.firstLow(vm.model.interfaceName)}`
        },
        defaultTplDir() {
            const vm = this;
            return `tpl`
        },
        fileName(type) {
            const vm = this;
            var name = snakeCase(vm.model.tableName)
            var tableDir = vm.model.dir.sql || vm.defaultDir().sql
            var moduleDir = vm.model.dir.module || vm.defaultDir().module
            var tplDir = vm.model.dir.tpl || vm.defaultDir().tpl
            var handleDir = vm.model.dir.handle || vm.defaultDir().handle
            var viewDir = vm.model.dir.view || vm.defaultDir().view
            var hash = {
                'ibase': `internal/${moduleDir}/interface/ds.go`,
                'base': `internal/${moduleDir}/ds.go`,
                "model": `internal/${tableDir}/sql_` + name + ".go",
                "ds": `internal/${moduleDir}/ds_${name}.go`,
                "ids": `internal/${moduleDir}/interface/ds_${name}.go`,
                'handle': `internal/${handleDir}/handle_manager_${name}.go`,
                'paging.html': `${tplDir}/admin/${name}.html`,
                'view': `internal/${viewDir}/view.go`,
            }
            return hash[type]
        },
        fileTitle(type) {
            var hash = {
                'ibase': `接口`,
                'base': `实现(New)`,
                "model": `SQL模型`,
                "ds": `实现(方法)`,
                "ids": `接口`,
                'handle': `路由`,
                'paging.html': `分页模版`
            }
            return hash[type]
        },
        copyAllCreateFile() {
            const vm = this
            var code = ""
            vm.codeType.forEach(function (type) {
                code += vm.copyCreateFile(type, "returnCode")
            })
            copy(code)
            vm.$message({
                message: '所有创建命令已到粘贴板,请打开终端/命令行进入项目根目录执行',
                type: "success",
            });
        },
        copyCreateFile(type, cmd) {
            const vm = this
            var existCode = `echo -e "\\033[1;33mfail:file exist\\033[0m"`
            if (type === 'ibase') {
                existCode = `sed -i '' '/type DS interface {/a\\'$'\\n\''coreDS${vm.modelData(type, 'onlySignName')}\n' ${vm.fileName(type)}
    echo -e "\\033[1;32msuccess: add code\\033[0m"`
            }
            var code = `
if [ -f "${vm.fileName(type)}" ]; then
    ${existCode}
else
    dir=$(dirname "${vm.fileName(type)}")
    mkdir -p "$dir"
    cat << 'EOF' > ${vm.fileName(type)}\n${vm.modelResult(type)}EOF
    if [ -f "${vm.fileName(type)}" ]; then
        echo -e "\\033[1;32msuccess: file created\\033[0m"
    fi
fi
            `
            if (cmd == "returnCode") {
                return code
            }
            copy(code)
            vm.$message({
                message: '命令已到粘贴板,请打开终端/命令行进入项目目录执行',
                type: "success",
            });
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
            var v = vm.model
            v.structName = h.toCamel(v.tableName);
            v.interfaceName = h.toCamel(v.tableName.replace(/_.*$/, ''))
            if (v.structName === v.interfaceName) {
                v.signName = v.structName
            } else {
                v.signName = v.structName.replaceAll(v.interfaceName, '')
            }
            v.signName = h.toCamel(v.signName)
            console.log(v.signName)
            vm.model = v
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
                if (!item.goTypeCustom) {
                    if (item.column.endsWith('id')) {
                        item.goTypeCustom = "ID" + h.toCamel(item.column.replace(/(_)?id$/, ''))
                        return
                    }
                    item.goTypeCustom = vm.model.structName + item.goField
                }
            }
        },
        blurColumnItem(index) {
            const vm = this;
            let item = vm.model.fields[index];
            let value = item.column;
            if (value == "id") {
                if (vm.model.codeStyle.camelCaseID == "ID") {
                    value = "ID";
                } else {
                    value = "Id"
                }
            }
            value = vm.modelData().c.snakeToCamel(value);
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
        const modelData = localStorage.getItem(MODEL_KEY);
        if (modelData) {
            try {
                model = extend(true, model, JSON.parse(modelData))
            } catch (err) {
                console.log(err);
            }
        }
        var codeTypeTab = querystring.parse(location.search).codeTypeTab || 'model'

        return {
            q: querystring.parse(location.search.slice(1)),
            exampleDataHash: exampleDataHash,
            migrateName: "Migrate_" + dayjs().format("YYYY_MM_DD__hh_mm") + "_",
            options: {
                camelCaseID: [
                    "ID",
                    'Id',
                ],
                templateField: {
                    "create_time update_time": [
                        {
                            column: "create_time",
                            goType: "time.Time",
                            goField: "CreateTime",
                            label: "创建时间",
                        },
                        {
                            column: "update_time",
                            goType: "time.Time",
                            goField: "UpdateTime",
                            label: "修改时间",
                        }
                    ],
                    "deleted_at updated_at": [
                        {
                            column: "deleted_at",
                            goType: "time.Time",
                            goField: "DeletedAt",
                            label: "创建时间",
                        },
                        {
                            column: "updated_at",
                            goType: "time.Time",
                            goField: "UpdatedAt",
                            label: "修改时间",
                        }
                    ],
                    "gmt_create gmt_modified": [
                        {
                            column: "gmt_create",
                            goType: "time.Time",
                            goField: "GMTCreate",
                            label: "创建时间",
                        },
                        {
                            column: "gmt_modified",
                            goType: "time.Time",
                            goField: "GMTModified",
                            label: "修改时间",
                        }
                    ],
                },
                softDelete: [
                    "sq.SoftDeleteTime",
                    "sq.SoftDeletedAt",
                    "sq.SoftIsDeleted",
                    "sq.WithoutSoftDelete",
                    "custom",
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
                    "sq.GMTCreateGMTModified",
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
            codeType: [
                'model',
                'ids',
                'ibase',
                'base',
                'ds',
                // 'paging.html',
                // 'view',
                // 'handle',
            ],
            codeTypeTab: codeTypeTab,
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
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    tab-size: 2;
    margin-bottom: 0;
}

.fields {
    margin-bottom: 10px;
    font-size: 0.8em
}

.fileList {
    padding: 1em;
    padding-top: 0;
    font-size: 12px;
}


.codeWindow {
    margin-top: .5em;
    background-color: white;
    border-radius: 5px;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, .1);
    position: relative;
    border: 1px solid #d0d7de;

    .language-go {
        margin-top: 0;
        padding: 1em;
    }
}

.codeWindowHead {
    padding-left: 17%;
    line-height: 30px;
    font-size: 12px;
}

.codeWindowHead::before {
    background: #fc625d;
    border-radius: 50%;
    box-shadow: 20px 0 #fdbc40, 40px 0 #35cd4b;
    content: ' ';
    height: 12px;
    position: absolute;
    top: 8px;
    width: 12px;
    left: 10px;
}

.codeWindow .el-tree {
    background: transparent;
}

.codeWindowFilename {
    display: inline-block;
    display: none;
    border-bottom: 1px solid #faf6f1;
    border-top-left-radius: 0.3em;
    border-top-right-radius: 0.3em;
    user-select: none;
    padding: 0 10px;
    font-weight: bold;
    line-height: 2;
}

.codeWindowTool {
    user-select: none;
    text-align: right;
    background: #fdf6e3;
    margin-bottom: -22px;
    line-height: 22px;
    padding-right: 5px;
}

.bit-exmaple-code {
    background: transparent;
    font-size: 12px;
    line-height: 1;
    overflow: hidden;
}

</style>
