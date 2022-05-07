export default `// Package m Generate by https://goclub.run/?k=model
package <#- v.packageName #>
import (
    "database/sql"
    sq "github.com/goclub/sql"
)

<# v.fields.forEach(function (item) { -#>
<# if(item.isPrimaryKey && item.isIDTypeAlias) {-#>
// ID<#- v.structName #> ID别名
type ID<#- v.structName #> <#- item.goType #>
func NewID<#- v.structName #>(id <#- item.goType #>) ID<#- v.structName #> {
    return ID<#- v.structName #>(id)
}
func (id ID<#- v.structName #>) <#= h.strToCamel(item.goType) #>() <#- item.goType #> {
    return <#- item.goType #>(id)
}
<# } -#>
<# }) -#>
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
type <#= v.structName #> struct {
<# v.fields.forEach(function (item) { -#>
<# if (item.comment) { #>    // <#= item.comment #>
<# } -#>
    <#= h.padGoField(item) #><#= h.padGoType(item) #> \`db:"<#= item.column #>"<#- h.sqTag(item)#>\`
<# }) -#>
    Table<#= v.structName #>
    <# if (v.fieldCreateUpdate != "无") { #><#= v.fieldCreateUpdate #><# } #>
    sq.DefaultLifeCycle
}
<# if (c.hasAutoIncrement()){#>
// AfterInsert 创建后自增字段赋值处理
func (v *<#= v.structName #>) AfterInsert(result sql.Result) error {
    id, err := result.LastInsertId(); if err != nil {
        return err
    }
<#if (c.autoIncrementItem()){-#>
    v.<#- c.autoIncrementItem().goField#> = <#- c.autoIncrementValueCode()#>
<#}-#>
    return nil
}
<# } #>
func (v Table<#= v.structName #>) Column() (col struct{
<# v.fields.forEach(function (item) { -#>
    <#= h.padGolFieldValue(item.goField)#> sq.Column
<#})-#>
    <#- c.ColumnFieldCreateUpdateTypeCode() #>
}) {
<# v.fields.forEach(function (item) { -#>
    col.<#= h.padGolFieldValue(item.goField)#> = "<#= item.column#>"
<#})-#>
    <#- c.ColumnFieldCreateUpdateValueCode() #>
    return
}

`
