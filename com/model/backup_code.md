```vue
 创建/更新时间:
<el-select v-model="model.fieldCreateUpdate" style="width: 15em">
<el-option
    v-for="item in options.fieldCreateUpdate"
    :key="item"
    :label="label(item)"
    :value="item"
></el-option>
</el-select>
```