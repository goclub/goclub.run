export default `
<el-form label-width="8em" size="mini" >
    <el-form-item label="UUID v4">
        {{UUID}} <el-button @click="copyUUID" >复制</el-button>               
    </el-form-item>
    <el-form-item label="short UUID v4">
        {{shortUUID}} <el-button @click="copyShortUUID" >复制</el-button>               
    </el-form-item>
    <el-form-item label="">
        <el-button @click="refreshUUID" >刷新</el-button>               
    </el-form-item>
</el-form>
`