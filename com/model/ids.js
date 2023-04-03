export default `
type DS interface {
	// 创建 
	Create<#- c.signName()#>(ctx context.Context, req I<#- v.interfaceName #>.Create<#- c.signName() #>Request) (<#= h.firstLow(v.structName) #> m.<#= v.structName #>, err error)
<#if (c.needUpdate()) { -#>
	// 更新
	Update<#- c.signName()#>(ctx context.Context, req I<#- v.interfaceName #>.Update<#- c.signName()#>Request) (err error)
<# } -#>
	// 查询(所有)
	<#- v.structName #>s(ctx context.Context) (list []m.<#= v.structName #>, err error)
	// 查询(单)
	<#- v.structName #>(ctx context.Context, <#= c.primaryKeyGoVarType() #>) (<#= h.firstLow(v.structName) #> m.<#= v.structName #>, has<#= v.structName #> bool,err error)
	// 查询(单), 必定存在,不存在返回 xerr.Reject 数据不存在
	Must<#- c.signName()#>(ctx context.Context, <#= c.primaryKeyGoVarType() #>) (<#= h.firstLow(v.structName) #> m.<#= v.structName #>, err error)
	// 存在(单)
	Has<#- c.signName()#>(ctx context.Context, <#= c.primaryKeyGoVarType() #>) (has bool, err error)
	// 存在(多) 入参主键的数量与数据库中数据的数量相等则返回 true
	Have<#- c.signName()#>(ctx context.Context, <#= h.firstLow(v.structName) #>IDs []m.ID<#= v.structName #>) (have bool, err error)
<# if (c.needPaging()) { -#>	// 分页
	Paging(ctx context.Context, req <#- v.interfaceName #>.Paging<#- c.signName()#>Request) (reply <#- v.interfaceName #>Paging<#- c.signName()#>Reply, err error)
<# } -#>
} 
type <#- v.interfaceName #>Paging<#- c.signName()#>Reply {
    List []<#- v.interfaceName #>Paging<#- c.signName()#>ReplyItem \`json:"list"\`
    Total uint64 \`json:"total"\`
}
type <#- v.interfaceName #>Paging<#- c.signName()#>ReplyItem {
<# c.pagingReplyFields().forEach(function (item) { -#>
    <#= c.padGoField(item) #> <#= c.padGoType(item, "m.") #>  \`json:"<#= h.firstLow(h.snakeToCamel(item.column)) #>"\`
<# }) -#>
}
<#if (c.needPaging()) { -#>  
type Paging<#- c.signName()#>Request struct {	
<# c.pagingReqFields().forEach(function (item) { -#>
    <#= c.padGoField(item) #><#= c.padGoType(item) #>
<# }) -#>
    m.Paging
}
type Paging<#- c.signName()#>Reply struct {	
<# c.pagingReplyFields().forEach(function (item) { -#>
    <#= c.padGoField(item) #><#= c.padGoType(item) #>
<# }) -#>
}
<# c.pagingReqFields().forEach(function (item) { -#>
    <#= c.padGoField(item) #><#= c.padGoType(item) #>
<# }) -#>
<# } -#>
<#if (c.needUpdate()) { -#>
type Update<#- c.signName()#>Request struct {
<#= c.primaryKeyGoStructFieldType() #>
<# c.updateFields().forEach(function (item) { -#>
    <#= c.padGoField(item) #><#= c.padGoType(item) #>
<# }) -#>
}
func (v Update<#- c.signName()#>Request) VD(r *vd.Rule) (err error) {
	// TODO: add validation rule 
	return
}
<# }-#>
type Create<#- c.signName()#>Request struct {
<# c.createFields().forEach(function (item) { -#>
    <#= c.padGoField(item) #><#= c.padGoType(item) #>
<# }) -#>
}
func (v Create<#- c.signName()#>Request) VD(r *vd.Rule) (err error) {
    // TODO: add validation rule
    return
}
`