export default `
<div>
 <el-form label-width="8em" size="mini" >
     <el-form-item label="迁移函数名">
        <el-button @click="copyMigrateName">{{migrateName}} </el-button>    
    </el-form-item>
     <el-form-item label="文档">
         <el-link type="primary" href="https://goclub.run/sql/" target="_blank" >goclub/sql</el-link>
     </el-form-item>
    <el-form-item label="示例配置">
        <el-button size="mini" type="primary" @click="useUserExampleData" >user</el-button>
    </el-form-item>
    <el-form-item label="package">
        <el-input style="width:10em;" placeholder="eg:user" v-model="model.packageName"></el-input>
    </el-form-item>
    <el-form-item label="name">
        struct:<el-input style="width:12em;" placeholder="eg:User" v-model="model.structName"  @blur="blurModelStructName" ></el-input>
        table:<el-input style="width:12em;" v-model="model.tableName"></el-input>
        <!--table struct:<el-input style="width:16em;" v-model="model.tableStructName"></el-input> -->
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
        <div v-if="model.softDelete == 'custom'" style="padding-left:2em;opacity: 0.8;">
            SoftDeleteWhere:
            <br />
            <el-input style="width:30em;" v-model="model.customSoftDelete.SoftDeleteWhere"/>
            <br />
            SoftDeleteSet:
            <br />
            <el-input style="width:30em;" v-model="model.customSoftDelete.SoftDeleteSet"/>
        </div>
    </el-form-item>
    <el-form-item label="创建更新时间">
        <el-select v-model="model.fieldCreateUpdate" style="width:15em;">
            <el-option
                v-for="item in options.fieldCreateUpdate"
                :key="item"
                :label="item"
                :value="item"
            ></el-option>
        </el-select>
    </el-form-item>
    <el-form-item label="字段">
        <table style="width:100%;">
            <thead>
                <tr>
                    <th>主键</th>
                    <th>自增</th>
                    <th>ID别名</th>
                    <th>GO字段</th>
                    <th>GO类型</th>
                    <th>table column</th>
                    <th>注释</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tr v-for="(row, index) in model.fields">
               <td>
                   <el-switch v-model="row.isPrimaryKey"> </el-switch>
               </td>
               <td>
                    <el-switch v-model="row.isAutoIncrement" @change="changeIsAutoIncrement(row,index)" > </el-switch>
               </td>
               <td>
                <el-switch v-if="row.isPrimaryKey" v-model="row.isIDTypeAlias"></el-switch>
               </td>
               <td>
                    <el-input v-model="row.goField"  @blur="blurGoFieldsItem(index)" > </el-input>
                </td>
               <td>
                   <el-select v-model="row.goType" style="width:10em;" >
                       <el-option
                           v-for="item in options.fieldType"
                           :key="item"
                           :label="label(item)"
                           :value="item"
                       ></el-option>
                   </el-select>
                    <el-input v-if="row.goType == 'custom'"  style="width:12em;"  placeholder="eg:UserLevel" v-model="row.goTypeCustom" ></el-input>
               </td>
               <td>
                   <el-input v-model="row.column"  > </el-input>
               </td>
               <td>
                   <el-input v-model="row.comment"  > </el-input>
               </td>
               <td>
                   <el-button  @click="removeFieldsItem(index)" size="mini" type="danger" icon="el-icon-remove"></el-button>
               </td>
           </tr>
        </table>

        <el-button @click="addNewField" type="primary" icon="el-icon-plus">添加字段</el-button>
    </el-form-item>
</el-form>
<el-button @click="copyCode" >复制代码</el-button>
<pre style="margin-top:0;margin-right:0.5em;" class="language-go" v-html="modelResultCode" ></pre>
<el-button @click="copyCode" >复制代码</el-button>
</div>
`
