export default `
// Generate by https://t.goclub.run
package <#- v.packageName #>
import (
    "database/sql"
    sq "github.com/goclub/sql"
)

<# v.fields.forEach(function (item) { -#>
<# if(item.isPrimaryKey && item.isIDTypeAlias) {-#>
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
// 给 TableName 加上指针 * 能避免 db.InsertModel(user) 这种错误， 应当使用 db.InsertModel(&user) 或
func (*Table<#- v.structName #>) TableName() string { return "<#= v.tableName#>" }
type <#= v.structName #> struct {
<# v.fields.forEach(function (item) { -#>
<# if (item.comment) { #>    // <#= item.comment #>
<# } -#>
    <#= h.padGoField(item) #><#= h.padGoType(item) #> \`db:"<#= item.column #>"<#- h.sqTag(item)#>\`
<# }) -#>
    Table<#= v.structName #>
    <#= v.fieldCreateUpdate #>
    sq.DefaultLifeCycle
}
func (v <#= v.structName #>) PrimaryKey() []sq.Condition {
    return sq.And(
    <# v.fields.forEach(function (item) { -#><# if (item.isPrimaryKey) {#> v.Column().<#= item.goField #>, sq.Equal(v.<#= item.goField #>), <#}#>  <# }) #>
    )
}
<# if (c.hasAutoIncrement()){#>
func (v *<#= v.structName #>) AfterCreate(result sql.Result) error {
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
