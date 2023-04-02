export default `
type DS interface {
    <#- c.subModelName()#>Create(ctx context.Context, req I<#- v.interfaceName #>.<#- c.subModelName()#>CreateRequest) (<#= h.firstLow(v.structName) #> m.<#= v.structName #>, err error)
    <#- c.subModelName()#>Update(ctx context.Context, req I<#- v.interfaceName #>.<#- c.subModelName()#>UpdateRequest) (err error)
    List(ctx context.Context) (list []m.structName, err error)
} 
type <#- c.subModelName()#>CreateRequest struct {
<# c.createFields().forEach(function (item) { -#>
    <#= c.padGoField(item) #><#= c.padGoType(item) #>
<# }) -#>
}
func (v <#- c.subModelName()#>CreateRequest) VD(r *vd.Rule) (err error) {
    // TODO: add validation rule
    return
}
type <#- c.subModelName()#>UpdateRequest struct {
<# if (c.primaryKey()){ -#>
    ID <#= c.padGoType(c.primaryKey()) #>
<# } -#>
<# c.updateFields().forEach(function (item) { -#>
    <#= c.padGoField(item) #><#= c.padGoType(item) #>
<# }) -#>
}
func (v <#- c.subModelName()#>UpdateRequest) VD(r *vd.Rule) (err error) {
    // TODO: add validation rule 
    return
}
`