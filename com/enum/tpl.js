export default `<div>
<el-form label-width="8em" size="mini" >
    <el-form-item label="示例配置">
        <el-button size="mini" @click="exampleMarkEnumsBySource" type="primary" >LogKind</el-button>       
    </el-form-item>
    <el-form-item label="type">
        <el-input  size="mini" placeholder="" style="width:10em;" @blur="amendEnumsName" v-model="enums.name"></el-input>
        <el-select style="width:7em;"  size="mini" v-model="enums.type" placeholder="请选择">
            <el-option
                    v-for="item in options.enumsType"
                    :key="item"
                    :label="item"
                    :value="item">
            </el-option>
        </el-select>
    </el-form-item>
    <el-form-item label="items">
        <el-tag  v-if="enums.type != 'uint8'" size="mini" type="info">建议先填 value</el-tag>
        <el-tag  v-if="enums.type == 'uint8'" size="mini" type="info">建议value从 1 开始，以避免 zero value 特性意外的插入0</el-tag>
        <el-tag  size="mini" type="info">尽量不要编辑已存在的 value</el-tag>
        <div v-for="(v, i) in enums.items" style="margin-bottom:0.5em;">
            <span style="display:inline-block;min-width:3em;"></span>
            <el-input placeholdeSourcer="field" size="mini" style="width:10em;" v-model="v.field" @blur="amendEnumsItemsField(i)" ></el-input>
            <el-input placeholder="value"  size="mini" style="width:10em;" @blur="amendEnumsItemsValue(i)" v-model="v.value" ></el-input>
            <el-button  @click="removeEnumsItem(i)" size="mini" type="danger" icon="el-icon-remove"></el-button>
        </div>
        <span style="display:inline-block;min-width:3em;"></span>
        <div><el-button  @click="createNewItem" size="mini" type="primary" icon="el-icon-plus"></el-button></div>
    </el-form-item>
    <el-form-item label="Source enums">
        <el-input placeholder="非必填" size="mini" style="width:20em;" v-model="source.enums"></el-input>
        <el-button size="mini" type="primary" @click="markEnumsBySource" >覆盖</el-button>
    </el-form-item>
    <el-button @click="copyCode" >复制代码</el-button>
    </el-form> 
    <pre style="margin-top:0;margin-right:0.5em;" class="language-go" v-html="enumsResultCode" ></pre>
    <el-button @click="copyCode" >复制代码</el-button>
</div>
`