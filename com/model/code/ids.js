export default `package I<#- v.interfaceName #>

import vd "github.com/goclub/validator"
import "time"
import "context"
import m "<#- c.dir().project #>/internal/<#- c.dir().sql #>"

type coreDS<#- c.signName()#> interface {
<#if (c.needCreate()) { -#>
	// Create<#- c.signName()#> 创建 
	Create<#- c.signName()#>(ctx context.Context, req Create<#- c.signName() #>Request<# if (c.authField()){ -#>, <#- h.firstLow(c.authField().goField) #> <#- c.goType(c.authField(), "m.")  #><# } #>) (<#= h.firstLow(v.structName) #> m.<#= v.structName #>, err error)
<# } -#>
<#if (c.needUpdate()) { -#>
	// Update<#- c.signName()#> 更新
	Update<#- c.signName()#>(ctx context.Context, req Update<#- c.signName()#>Request<# if (c.authField()){ -#>, <#- h.firstLow(c.authField().goField) #> <#- c.goType(c.authField(), "m.")  #><# } #>) (err error)
<# } -#>
	// <#- c.signName() #>s 查询(所有)
	<#- c.signName() #>s(ctx context.Context) (list []m.<#= v.structName #>, err error)
	// <#- c.signName() #> 查询(单)
	<#- c.signName() #>(ctx context.Context, <#= c.primaryKeyGoVarType() #>) (<#= h.firstLow(v.structName) #> m.<#= v.structName #>, has<#= v.structName #> bool,err error)
	// Must<#- c.signName()#> 查询(单), 必定存在,不存在返回 xerr.Reject 数据不存在
	Must<#- c.signName()#>(ctx context.Context, <#= c.primaryKeyGoVarType() #>) (<#= h.firstLow(v.structName) #> m.<#= v.structName #>, err error)
	// Has<#- c.signName()#> 存在(单)
	Has<#- c.signName()#>(ctx context.Context, <#= c.primaryKeyGoVarType() #>) (has bool, err error)
	// MustHas<#- c.signName()#> 必定存在,不存在返回 xerr.Reject 数据不存在
	MustHas<#- c.signName()#>(ctx context.Context, <#= c.primaryKeyGoVarType() #>) (err error)
	// Have<#- c.signName()#> 存在(多) 入参主键的数量与数据库中数据的数量相等则返回 true
	Have<#- c.signName()#>(ctx context.Context, <#= h.firstLow(v.structName) #>IDs []m.ID<#= v.structName #>) (have bool, err error)
<# if (c.needPaging()) { -#>
	Admin<#- c.signName()#>s(ctx context.Context, req Admin<#- c.signName()#>sRequest) (reply Admin<#- c.signName()#>sReply, err error)
<# if (c.authField()) { -#>
	<#- c.AuthFieldSign() #><#- c.signName()#>s(ctx context.Context, req <#- c.AuthFieldSign() #><#- c.signName()#>sRequest, <#- h.firstLow(c.authField().goField) #> <#- c.goType(c.authField(), "m.")  #>) (reply <#- c.AuthFieldSign() #><#- c.signName()#>sReply, err error)
	<#- c.AuthFieldSign() #><#- c.signName()#>(ctx context.Context, <#= c.primaryKeyGoVarType() #>, <#- h.firstLow(c.authField().goField) #> <#- c.goType(c.authField(), "m.")  #>) (reply <#- c.AuthFieldSign() #><#- c.signName()#>Reply, err error)
<# } -#>
<# } -#>
<# if(c.authField()) {-#>
  Auth<#- c.signName()#>(ctx context.Context, <#= h.firstLow(v.structName) #> m.<#= v.structName #>, <#- h.firstLow(c.authField().goField) #> <#- c.goType(c.authField(), "m.")  #>)(err error)
  Auth<#- c.signName()#>ID(ctx context.Context, <#= c.primaryKeyGoVarType() #>, <#- h.firstLow(c.authField().goField) #> <#- c.goType(c.authField(), "m.")  #>)(err error)
<# } -#>
}
<#if (c.needPaging()) { -#>  
type Admin<#- c.signName()#>sRequest struct {	
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
func (v Admin<#- c.signName()#>sRequest) VD(r *vd.Rule) (err error) {
	// TODO implement me
}
type Admin<#- c.signName()#>sReply struct {
    List []Admin<#- c.signName()#>sReplyItem \`json:"list"\`
    Total uint64 \`json:"total"\`
}
type Admin<#- c.signName()#>sReplyItem struct {
<# c.pagingReplyFields().forEach(function (item) { -#>
    <#= c.padGoField(item) #> <#= c.padGoType(item, "m.") #>  \`json:"<#= h.firstLow(c.snakeToCamel(item.column)) #>"\`
<# }) -#>
}
<# if (c.authField()) { -#>
type <#- c.AuthFieldSign() #><#- c.signName()#>Reply struct {
<# c.pagingReplyFields().forEach(function (item) { -#>
    <#= c.padGoField(item) #> <#= c.padGoType(item, "m.") #>  \`json:"<#= h.firstLow(c.snakeToCamel(item.column)) #>"\`
<# }) -#>
}
type <#- c.AuthFieldSign() #><#- c.signName()#>sRequest struct {  
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
func (v <#- c.AuthFieldSign() #><#- c.signName()#>sRequest) VD(r *vd.Rule) (err error) {
	// TODO implement me
}
type <#- c.AuthFieldSign() #><#- c.signName()#>sReply struct {
    List []<#- c.AuthFieldSign() #><#- c.signName()#>sReplyItem \`json:"list"\`
    Total uint64 \`json:"total"\`
}
type <#- c.AuthFieldSign() #><#- c.signName()#>sReplyItem struct {
<# c.pagingReplyFields().forEach(function (item) { -#>
    <#= c.padGoField(item) #> <#= c.padGoType(item, "m.") #>  \`json:"<#= h.firstLow(c.snakeToCamel(item.column)) #>"\`
<# }) -#>
}
<# } -#>
<# } -#>
<#if (c.needCreate()) { -#>
type Create<#- c.signName()#>Request struct {
<# c.createFields().forEach(function (item) { -#><# if (item.isAuth){return} -#>
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
<#- c.primaryKeyGoStructFieldType("m.") #>
<# c.updateFields().forEach(function (item) { -#><# if (item.isAuth){return} -#>
    <#= c.padGoField(item) #><#= c.padGoType(item) #> \`json:"<#= h.firstLow(c.snakeToCamel(item.column)) #>"\`
<# }) -#>
}
func (v Update<#- c.signName()#>Request) VD(r *vd.Rule) (err error) {
	// TODO: add validation rule 
	return
}
<# }-#>
`