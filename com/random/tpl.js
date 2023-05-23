export default `
<el-form label-width="8em" size="mini" >
    <el-form-item label="UUID v4">
        <code>{{UUID}}</code> <el-button @click="copy('UUID')" >复制</el-button>               
    </el-form-item>
    <el-form-item label="short UUID v4">
        <code>{{shortUUID}}</code> <el-button @click="copy('shortUUID')" >复制</el-button>               
    </el-form-item>
   
    <el-form-item label="nanoid v4">
    <el-input-number  size="mini" v-model="nanoidLength" @change="changeNanoidLength"></el-input-number>
    <br>
        <code>{{nanoid}}</code> <el-button @click="copy('nanoid')" >复制</el-button>               
    </el-form-item>
    <el-form-item label="">
        <el-button @click="refresh" type="primary" >刷新</el-button>               
    </el-form-item>
</el-form>
`