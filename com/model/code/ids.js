export default `package I<#- v.interfaceName #>

import vd "github.com/goclub/validator"
import "time"

type coreDS<#- c.signName()#> interface {
<#if (c.needCreate()) { -#>
	// Create<#- c.signName()#> 创建 
	Create<#- c.signName()#>(ctx context.Context, req Create<#- c.signName() #>Request) (<#= h.firstLow(v.structName) #> m.<#= v.structName #>, err error)
<# } -#>
<#if (c.needUpdate()) { -#>
	// Update<#- c.signName()#> 更新
	Update<#- c.signName()#>(ctx context.Context, req Update<#- c.signName()#>Request, clientID m.IDClient) (err error)
<# } -#>
	// <#- c.signName() #>s 查询(所有)
	<#- c.signName() #>s(ctx context.Context) (list []m.<#= v.structName #>, err error)
	// <#- c.signName() #> 查询(单)
	<#- c.signName() #>(ctx context.Context, <#= c.primaryKeyGoVarType() #>) (<#= h.firstLow(v.structName) #> m.<#= v.structName #>, has<#= v.structName #> bool,err error)
	// Must<#- c.signName()#> 查询(单), 必定存在,不存在返回 xerr.Reject 数据不存在
	Must<#- c.signName()#>(ctx context.Context, <#= c.primaryKeyGoVarType() #>) (<#= h.firstLow(v.structName) #> m.<#= v.structName #>, err error)
	// Has<#- c.signName()#> 存在(单)
	Has<#- c.signName()#>(ctx context.Context, <#= c.primaryKeyGoVarType() #>) (has bool, err error)
	// Have<#- c.signName()#> 存在(多) 入参主键的数量与数据库中数据的数量相等则返回 true
	Have<#- c.signName()#>(ctx context.Context, <#= h.firstLow(v.structName) #>IDs []m.ID<#= v.structName #>) (have bool, err error)
<# if (c.needPaging()) { -#>
	AdminPaging<#- c.signName()#>(ctx context.Context, req AdminPaging<#- c.signName()#>Request) (reply AdminPaging<#- c.signName()#>Reply, err error)
<# if (c.authField()) { -#>
	<#- c.AuthFieldSign() #>Paging<#- c.signName()#>(ctx context.Context, req <#- c.AuthFieldSign() #>Paging<#- c.signName()#>Request, <#- h.firstLow(c.authField().goField) #> <#- c.goType(c.authField(), "m.")  #>) (reply <#- c.AuthFieldSign() #>Paging<#- c.signName()#>Reply, err error)
<# } -#>
<# } -#>
<# if(c.authField()) {-#>
  Auth<#- c.signName()#>(ctx context.Context, <#= h.firstLow(v.structName) #> m.<#= v.structName #>, <#- h.firstLow(c.authField().goField) #> <#- c.goType(c.authField(), "m.")  #>)(err error)
  Auth<#- c.signName()#>ID(ctx context.Context, <#= c.primaryKeyGoVarType() #>, <#- h.firstLow(c.authField().goField) #> <#- c.goType(c.authField(), "m.")  #>)(err error)
<# } -#>
}
<#if (c.needPaging()) { -#>  
type AdminPaging<#- c.signName()#>Request struct {	
<# c.pagingReqFields().forEach(function (item) { -#>
<# if (item.goType.toLowerCase().includes('time') || item.goType.toLowerCase().includes('date')) {-#>
    Start<#= c.padGoField(item) #><#= c.padGoType(item, "m.") #> \`json:"<#= h.firstLow(c.snakeToCamel(item.column)) #>"\`
    End<#= c.padGoField(item) #><#= c.padGoType(item, "m.") #> \`json:"<#= h.firstLow(c.snakeToCamel(item.column)) #>"\`
<# } else { -#>
    <#= c.padGoField(item) #><#= c.padGoType(item, "m.") #> \`json:"<#= h.firstLow(c.snakeToCamel(item.column)) #>"\`
<# } -#>
<# }) -#>
    m.Paging
}
type AdminPaging<#- c.signName()#>Reply struct {
    List []Paging<#- c.signName()#>ReplyItem \`json:"list"\`
    Total uint64 \`json:"total"\`
}
type AdminPaging<#- c.signName()#>ReplyItem struct {
<# c.pagingReplyFields().forEach(function (item) { -#>
    <#= c.padGoField(item) #> <#= c.padGoType(item, "m.") #>  \`json:"<#= h.firstLow(c.snakeToCamel(item.column)) #>"\`
<# }) -#>
}
<# if (c.authField()) { -#>
type <#- c.AuthFieldSign() #>Paging<#- c.signName()#>Request struct {  
<# c.pagingReqFields().forEach(function (item) { -#><# if (item.isAuth){return} -#>
<# if (item.goType.toLowerCase().includes('time') || item.goType.toLowerCase().includes('date')) {-#>
    Start<#= c.padGoField(item) #><#= c.padGoType(item, "m.") #> \`json:"<#= h.firstLow(c.snakeToCamel(item.column)) #>"\`
    End<#= c.padGoField(item) #><#= c.padGoType(item, "m.") #> \`json:"<#= h.firstLow(c.snakeToCamel(item.column)) #>"\`
<# } else { -#>
    <#= c.padGoField(item) #><#= c.padGoType(item, "m.") #> \`json:"<#= h.firstLow(c.snakeToCamel(item.column)) #>"\`
<# } -#>
<# }) -#>
    m.Paging
}
type <#- c.AuthFieldSign() #>Paging<#- c.signName()#>Reply struct {
    List []Paging<#- c.signName()#>ReplyItem \`json:"list"\`
    Total uint64 \`json:"total"\`
}
type <#- c.AuthFieldSign() #>Paging<#- c.signName()#>ReplyItem struct {
<# c.pagingReplyFields().forEach(function (item) { -#>
    <#= c.padGoField(item) #> <#= c.padGoType(item, "m.") #>  \`json:"<#= h.firstLow(c.snakeToCamel(item.column)) #>"\`
<# }) -#>
}
<# } -#>
<# } -#>
<#if (c.needCreate()) { -#>
type Create<#- c.signName()#>Request struct {
<# c.createFields().forEach(function (item) { -#>
    <#= c.padGoField(item) #><#= c.padGoType(item, "m.") #> \`json:"<#= h.firstLow(c.snakeToCamel(item.column)) #>"\`
<# }) -#>
}
func (v Create<#- c.signName()#>Request) VD(r *vd.Rule) (err error) {
    // TODO: add validation rule
    return
}
<# }-#>
<#if (c.needUpdate()) { -#>
type Update<#- c.signName()#>Request struct {
<#- c.primaryKeyGoStructFieldType() #>
<# c.updateFields().forEach(function (item) { -#>
    <#= c.padGoField(item) #><#= c.padGoType(item) #> \`json:"<#= h.firstLow(c.snakeToCamel(item.column)) #>"\`
<# }) -#>
}
func (v Update<#- c.signName()#>Request) VD(r *vd.Rule) (err error) {
	// TODO: add validation rule 
	return
}
<# }-#>
`