export default `
<div>
 <el-form label-width="4em" size="mini" >
    <el-form-item label="内容">
        <el-tag style="cursor: pointer;" size="mini" @click="addPrefix('https://')">https://</el-tag>
        <el-tag style="cursor: pointer;" size="mini"  @click="addPrefix('http://')">http://</el-tag>
        <el-input ref="qrcodeInput" placeholder="请输入二维码内容" type="textarea" v-model="form.qrcode" ></el-input>       
    </el-form-item>
    <el-form-item label="">
               <el-button @click="clickRenderButton"  plain type="primary" style="width:100%" size="large" >生成</el-button>
    </el-form-item>
    </el-form>
  <el-row>
  <el-col :span="10">
      <div style="padding-left: 3.6em;">
        <div style="padding:1em;background: white;border:1px solid #ddd;display:inline-block;" >
            <qrcode-vue :value="result" :size="form.size" ></qrcode-vue>
        </div>
        <div style="padding-top: 1em;">
        尺寸: <el-input-number v-model="form.size"  :min="50" :max="300" ></el-input-number>
        </div>
      </div>
    </el-col>
    <el-col :span="14">
      <div>最近生成的二维码 </div>
         <el-table
            :max-height="form.size+16"
          :data="form.history"
          style="width: 100%">
          <el-table-column
            label="内容"
            prop="content"
            >
          </el-table-column>
          <el-table-column
            label="时间"
            prop="time"
            >
          </el-table-column>
          <el-table-column label="操作" >
            <template slot-scope="scope">
                <el-link type="primary" @click="useHistory(scope.row)">生成</el-link>
                <el-link @click="delHistory(scope.row.content)">删除</el-link>
            </template>
          </el-table-column>
          
        </el-table>
    </el-col>
    </el-row>
  
</div>
`