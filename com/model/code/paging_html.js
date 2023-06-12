export default `[[extends "./layout/pc.html"]]
[[block main()]]
<ta-pc :header="header">
    <ta-box title="列表">
        <template slot="tools">
            <el-button @click="_jump(url_<#= v.tableName #>_create())" type="primary" >创建</el-button>
        </template>
        <el-form :inline="true">
<# c.pagingReqFields().forEach(function (item) { -#>
            <el-form-item label="<#= h.firstLow(c.snakeToCamel(item.column)) #>">
<# if (item.goType == 'custom') { -#>
                <el-select v-model="search.<#= h.firstLow(c.snakeToCamel(item.column)) #>" placeholder="全部">
                    <!-- _enum().<#= h.firstLow(item.goField) #> 在 project.js 中配置 -->
                    <el-option 
                <# if (item.goField.toLowerCase().endsWith('id')) { -#>
        v-if="option.<#= h.firstLow(item.goField).replace(/id$/, '').replace(/ID$/, '') #>" v-for="(item, key) in option.<#= h.firstLow(item.goField).replace(/id$/, '').replace(/ID$/, '') #>"
                <# } else { -#>
        v-if="_enum().<#= h.firstLow(item.goField)" v-for="(item, key) in _enum().<#= h.firstLow(item.goField) #>"
                <# } -#>
        :key="item.key" :value="item.value" :label="item.label"
                    ></el-option>
                </el-select>
<# } else if(item.goType.indexOf('uint') != -1) { -#>
                <el-input-number :min="0" v-model="search.<#= h.firstLow(c.snakeToCamel(item.column)) #>"></el-input-number>
<# } else if(item.goType.indexOf('int') != -1) { -#>
                <el-input-number v-model="search.<#= h.firstLow(c.snakeToCamel(item.column)) #>"></el-input-number>
<# } else if(item.goType.indexOf('float') != -1) { -#>
                <el-input-number  v-model="search.<#= h.firstLow(c.snakeToCamel(item.column)) #>" :precision="2"></el-input-number>
<# } else if(item.goType.indexOf('bool') != -1) { -#>
                <el-switch v-model="search.<#= h.firstLow(c.snakeToCamel(item.column)) #>" ></el-switch>
<# } else if(item.goType.indexOf('.Time') != -1) { -#>
                <el-time-picker v-model="search.<#= h.firstLow(c.snakeToCamel(item.column)) #>" ></el-time-picker>
<# } else if(item.goType.indexOf('xtime.Date') != -1) { -#>
                <el-date-picker v-model="search.<#= h.firstLow(c.snakeToCamel(item.column)) #>" ></el-date-picker>
<# } else{ -#>
                <el-input v-model="search.<#= h.firstLow(c.snakeToCamel(item.column)) #>"></el-input>
<# } -#>
            </el-form-item>
<# }) -#>
                <el-button type="primary" @click="_list(search)">查询</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="list" style="width: 100%">
<# c.pagingReplyFields().forEach(function (item) { -#>
            <el-table-column label="<#= h.firstLow(c.snakeToCamel(item.column)) #>" prop="<#= c.label(item) #>" <#if (h.firstLow(c.snakeToCamel(item.column)) == "id"){ #> width="50" <# } -#> ></el-table-column>
<# }) -#>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" @click="_jump(url_<#= v.tableName #>__update(scope.row.id))" >编辑</el-button>
                </template>i
            </el-table-column>
        </el-table>
        <el-pagination
                :total="total"
                :current-page="Number(search.page)"
                @current-change="_list(search, $event, null)"
                @size-change="_list(search, null, $event)"
                :page-size="Number(search.perPage) || 10"
                style="text-align: center;padding:1em;"
                background
                layout="prev, pager, next, sizes"
        >
        </el-pagination>
    </ta-box>
</ta-pc>
[[end]]
[[block script()]]
<script>
    window.__RENDER_DATA = [[raw(xjson(.))]];
    console.log("__RENDER_DATA", JSON.parse(JSON.stringify(__RENDER_DATA)))
</script>
<script type="module" >
    const header = [
        {
            title: "首页",
            url: TA.m.url_home(),
        },
        {
            title: "列表",
        },
    ]
    const vm = new Vue({
        components: {},
        el: "#ta-app",
        data: function () {
            const out = {
                ...__RENDER_DATA,
                search:TA.m._readSearch(),
                header: header,
            }
            console.log("vue data:", JSON.parse(JSON.stringify(out)))
            return out
        },
        created() {
            const vm = this
        },
        methods: {
            ...TA.m,
        },
        computed:{

        }
    })
</script>
<style>

</style>
[[end]]
`