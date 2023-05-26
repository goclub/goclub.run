export default `// Package m Generate by https://goclub.run/?k=model
package <#- v.packageName #>
import (
    sq "github.com/goclub/sql"
    "strconv"
)

<# if(c.primaryKey() && v.isIDTypeAlias) {-#>
// ID<#- v.structName #> 用于类型约束
// 比如 userID managerID 都是 uint64,编码的时候如果传错就会出现bug
// 通过 ID<#- v.structName #> 进行类型约束,如果参数不对编译器就会报错
type ID<#- v.structName #> <#- c.primaryKey().goType #>
func NewID<#- v.structName #>(id <#- c.primaryKey().goType #>) ID<#- v.structName #> {
    return ID<#- v.structName #>(id)
}
func (id ID<#- v.structName #>) <#= h.toCamel(c.primaryKey().goType) #>() <#- c.primaryKey().goType #> {
    return <#- c.primaryKey().goType #>(id)
}
<# if (c.primaryKey().goType.includes("uint")) {-#>
func (id ID<#- v.structName #>) String() {
    return strconv.FormatUint(uint64(v), 10)
}
<# } else if (c.primaryKey().goType.includes("int")) {-#>
func (id ID<#- v.structName #>) String() {
    return strconv.FormatInt(int64(v), 10)
}
<# } -#>
<# } -#>
// 底层结构体,用于组合出 model
type Table<#- v.structName #> struct {
<# if (v.softDelete != "custom") { -#>
    <#= v.softDelete #>
<#} -#>
}

<# if (v.softDelete == "custom") { -#>
func (Table<#- v.structName #>) SoftDeleteWhere() Raw {<#- v.customSoftDelete.SoftDeleteWhere #>}
func (Table<#- v.structName #>) SoftDeleteSet() Raw   {<#- v.customSoftDelete.SoftDeleteSet #>}
<#} -#>
// TableName 给 TableName 加上指针 * 能避免 db.InsertModel(user) 这种错误， 应当使用 db.InsertModel(&user) 或
func (*Table<#- v.structName #>) TableName() string { return "<#= v.tableName#>" }

// User model
type <#= v.structName #> struct {
<# v.fields.forEach(function (item) { -#>
    <#= c.padGoField(item) #><#= c.padGoType(item) #> \`db:"<#= item.column #>"<#- c.sqTag(item)#>\`<# if (item.comment) { #>  <#= item.comment #><# } #>
<# }) -#>
    Table<#= v.structName #>
    <# if (v.fieldCreateUpdate != "无") { #><#= v.fieldCreateUpdate #><# } #>
    sq.DefaultLifeCycle
}
<# if (c.isAutoIncrement()){#>
// AfterInsert 创建后自增字段赋值处理
func (v *<#= v.structName #>) AfterInsert(result sq.Result) (err error) {
    var id uint64 
    if id, err = result.LastInsertUint64Id(); err != nil {
        return 
    }
    v.<#- c.autoIncrementItem().goField#> = <#- c.autoIncrementValueCode()#>
    return
}
<# } #>
// Column 列名字典
func (v Table<#= v.structName #>) Column() (col struct{
<# v.fields.forEach(function (item) { -#>
    <#= c.padGoField(item)#> sq.Column
<#})-#>
    <#- c.columnFieldCreateUpdateTypeCode() #>
}) {
<# v.fields.forEach(function (item) { -#>
    col.<#= c.padGoField(item)#>=  "<#= item.column#>"
<#}) -#>
    <#- c.columnFieldCreateUpdateValueCode() #>
    return
}
`