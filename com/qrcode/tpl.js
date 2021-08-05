export default `
<div>
<el-form size="mini" >
   <el-form-item label="">
       <el-tag style="cursor: pointer;" size="mini" @click="addPrefix('https://')">https://</el-tag>
       <el-tag style="cursor: pointer;" size="mini"  @click="addPrefix('http://')">http://</el-tag>
       <el-input ref="qrcodeInput" placeholder="请输入二维码内容" type="textarea" v-model="form.qrcode" ></el-input>
   </el-form-item>
   <el-form-item label="">
              <el-button @click="clickRenderButton"  plain type="primary" style="width:100%" size="large" >生成</el-button>
   </el-form-item>
   </el-form>
 <el-row>
 <el-col :span="10" :xs="12">
     <div style="padding-left: 0em;">
       <div style="padding:1em;background: white;border:1px solid #ddd;display:inline-block;" >
           <qrcode-vue :value="result" :size="form.size" ></qrcode-vue>
       </div>
       <div style="padding-top: 1em;">
       尺寸: <el-input-number :step="20"  v-model="form.size"  :min="50" :max="330" ></el-input-number>
       </div>
     </div>
   </el-col>
   <el-col :span="14" :xs="24" >

     <div>最近生成的二维码</div>
     <table style="width:100%;">
        <thead>
            <tr style="text-align:left;" >
            <th>内容</th>
            <th>时间</th>
            <th style="min-width:3em;">操作</th>
            </tr>
        </thead>
        <tr v-for="item in form.history" style="line-height:2em;">
            <td>
            {{item.content}}
            </td>
            <td>{{item.time}}</td>
            <td>
                <el-link type="primary" @click="useHistory(item.content)">生成</el-link>
                <el-link @click="delHistory(item.content)">删除</el-link>
            </td>
        </tr>
     </table>
   </el-col>
   </el-row>
</div>
`
