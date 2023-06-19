export default `package <#- v.interfaceName #>

import "<#- c.dir().project #>/internal/<#- c.dir().module #>/interface"
import "<#- c.dir().project #>/internal/core/reject_code"
import sl "github.com/goclub/slice"
import sq "github.com/goclub/sql"
import xerr "github.com/goclub/error"
import "context"
import "time"
import m "<#- c.dir().project #>/internal/<#- c.dir().sql #>"
<#if (c.needCreate()) { -#>
func (dep DS) Create<#- c.signName()#>(ctx context.Context, req I<#- v.interfaceName #>.Create<#- c.signName()#>Request<# if (c.authField()){ -#>, <#- h.firstLow(c.authField().goField) #> <#- c.goType(c.authField(), "m.")  #><# } #>) (<#= h.firstLow(v.structName) #> m.<#= v.structName #>, err error){
	<#- h.firstLow(v.structName) #> = m.<#- v.structName #>{
<# if (c.authField()){ -#>    <#= c.authField().goField #>: <#- h.firstLow(c.authField().goField) #>,<# } #>
<# c.createFields().forEach(function (item) { -#><# if (item.isAuth){return} -#>
		<#= c.padGoField(item) #>: req.<#= item.goField -#>,
<# }) -#>
	}
	if _, err = dep.mysql.Main.InsertModel(ctx, &<#- h.firstLow(v.structName) #>, sq.QB{}); err != nil {
		return
	}
	return
}
<# }-#>
<#if (c.needUpdate()) { -#>
func (dep DS) Update<#- c.signName()#>(ctx context.Context, req I<#- v.interfaceName #>.Update<#- c.signName()#>Request<# if (c.authField()){ -#>, <#- h.firstLow(c.authField().goField) #> <#- c.goType(c.authField(), "m.")  #><# } #>) (err error){
	col := m.Table<#- v.structName#>{}.Column()
	var updateData = map[sq.Column]interface{}{
<# c.updateFields().forEach(function (item) { -#><# if (item.isAuth){return} -#>
		col.<#= c.padGoField(item) #>: req.<#= item.goField -#>,
<# }) -#>
	}
	if _, err = dep.mysql.Main.Update(ctx, &m.Table<#- v.structName#>{}, sq.QB{
		Set:   sq.SetMap(updateData),
		Where: <#- c.primaryKeyGoSQLWhereCode(3, "req.") #><# if (c.authField()){ #>.
		        And(col.<#- c.authField().goField #>, sq.Equal(<#- h.firstLow(c.authField().goField) #>))<# } #>,
		Limit: 1,
	}); err != nil {
		return
	}
	return
}
<# }-#>
func (dep DS) <#- c.signName(v.structName) #>s(ctx context.Context) (list []m.<#- v.structName#>, err error) {
	err = dep.mysql.Main.QuerySlice(ctx, &list, sq.QB{
		WhereAllowEmpty: true,
	})
	if err != nil {
		return
	}
	return
}
func (dep DS) <#- c.signName(v.structName)#>(ctx context.Context, <#= c.primaryKeyGoVarType() #>) (<#= h.firstLow(v.structName) #> m.<#= v.structName #>, has<#= v.structName #> bool, err error){
	col := m.<#= v.structName #>{}.Column()
	if has<#= v.structName #>, err = dep.mysql.Main.Query(ctx, &<#= h.firstLow(v.structName) #>, sq.QB{
		Where:  <#= c.primaryKeyGoSQLWhereCode(3) #>,
	}); err != nil {
		return
	}
	return
}
func (dep DS) Must<#- c.signName()#>(ctx context.Context, <#= c.primaryKeyGoVarType() #>) (<#= h.firstLow(v.structName) #> m.<#= v.structName #>, err error){
	var has bool
	if <#= h.firstLow(v.structName) #>, has, err = dep.<#- c.signName(v.structName)#>(ctx, <#= c.primaryKeyGoVar() #>); err != nil {
		return
	}
	if has == false {
		err = xerr.Reject(RejectCode.BaseDataNotFound, "", true)
		return
	}
	return
}
func (dep DS) Has<#- c.signName()#>(ctx context.Context, <#= c.primaryKeyGoVarType() #>) (has<#= v.structName #> bool, err error){
	col := m.<#= v.structName #>{}.Column()
	if has<#= v.structName #>, err = dep.mysql.Main.Has(ctx, &m.<#= v.structName #>{}, sq.QB{
		Where:  <#= c.primaryKeyGoSQLWhereCode(3) #>,
	}); err != nil {
		return
	}
	return
}
func (dep DS) MustHas<#- c.signName()#>(ctx context.Context, <#= c.primaryKeyGoVarType() #>) (err error){
	var has bool
	if has ,err = dep.Has<#- c.signName()#>(ctx, <#= c.primaryKeyGoVar() #>); err != nil {
		return
	}
	if has == false {
		return xerr.Reject(RejectCode.BaseDataNotFound, "", true)
	}
	return
}
func (dep DS) Have<#- c.signName()#>(ctx context.Context, <#= h.firstLow(v.structName) #>IDs []m.ID<#= v.structName #>) (have<#= v.structName #> bool, err error) {
	<#= h.firstLow(v.structName) #>IDs = sl.Unique(<#= h.firstLow(v.structName) #>IDs)
	col := m.<#= v.structName #>{}.Column()
	var count uint64
	if count, err = dep.mysql.Main.Count(ctx, &m.<#= v.structName #>{}, sq.QB{
 		Where:  sq.
 			And(col.ID, sq.In(<#= h.firstLow(v.structName) #>IDs)),
 	}); err != nil {
	    return
	}
	if count == 0 {
		return
	} else if count == uint64(len(<#= h.firstLow(v.structName) #>IDs)) {
		have<#= v.structName #> = true
		return
	}  else {
		return
	}
}
<# if (c.needPaging()) { -#>
func (dep DS) AdminPaging<#- c.signName()#>(ctx context.Context, req I<#- v.interfaceName #>.AdminPaging<#- c.signName()#>Request) (reply I<#- v.interfaceName #>.AdminPaging<#- c.signName()#>Reply, err error){
	col := m.<#= v.structName #>{}.Column()
	var list  []m.<#- v.structName#>
	var qb = sq.QB{
	    Where:sq.
<# c.pagingReqFields().forEach(function (item, index) { -#>
<# if (item.goType.toLowerCase().includes('time') || item.goType.toLowerCase().includes('date')) {-#>
        And(col.<#= item.goField #>, sq.IF(req.req.Start<#= item.goField #>.IsZero() == false, sq.Between(req.Begin<#= item.goField #>, req.End<#= item.goField #>))<#- h.endSymbol(c.pagingReqFields(), index, ".", ",") #>,
<# } else { -#>
        And(col.<#= item.goField #>, sq.IF(req.<#- c.SQIFCode(item) #>, sq.<# if(item.goType == "string"){#>Like<#}else {#>Equal<#}#>(req.<#= item.goField #>)))<#- h.endSymbol(c.pagingReqFields(), index, ".", ",") #>
<# } -#>
<# }) -#>
        OrderBy:[]sq.OrderBy{{col.ID, sq.DESC}},
	}
	if reply.Total, err = dep.mysql.Main.Count(ctx, &m.<#= v.structName #>{}, qb); err != nil {
	    return
    }
    if reply.Total == 0 {
        return
    }
    if err = dep.mysql.Main.QuerySlice(ctx, &list, qb.Paging(req.Page, req.PerPage)); err != nil {
        return
    }
    reply.List = sl.Map(list, func (v m.<#= v.structName #>) I<#- v.interfaceName #>.AdminPaging<#- c.signName()#>ReplyItem {
    return I<#- v.interfaceName #>.AdminPaging<#- c.signName()#>ReplyItem{
    <# c.pagingReplyFields().forEach(function (item) { -#>
        <#= c.padGoField(item) #>: v.<#= item.goField -#>,
    <# }) -#>
    }
    })
    return
}
<# if (c.authField()) { -#>
func (dep DS) <#- c.AuthFieldSign() #>Paging<#- c.signName()#>(ctx context.Context, req I<#- v.interfaceName #>.<#- c.AuthFieldSign() #>Paging<#- c.signName()#>Request, <#- h.firstLow(c.authField().goField) #> <#- c.goType(c.authField(), "m.")  #>) (reply I<#- v.interfaceName #>.<#- c.AuthFieldSign() #>Paging<#- c.signName()#>Reply, err error){
	col := m.<#= v.structName #>{}.Column()
	var list  []m.<#- v.structName#>
	var qb = sq.QB{
	    Where:sq.
<# c.pagingReqFields().forEach(function (item, index) { -#>
<# if (item.isAuth){ -#>
        And(col.<#= item.goField #>, sq.Equal(<#- h.firstLow(c.authField().goField) #>))<#- h.endSymbol(c.pagingReqFields(), index, ".", ",") #>
<# return; } -#>
<# if (item.goType.toLowerCase().includes('time') || item.goType.toLowerCase().includes('date')) {-#>
        And(col.<#= item.goField #>, sq.IF(req.req.Start<#= item.goField #>.IsZero() == false, sq.Between(req.Begin<#= item.goField #>, req.End<#= item.goField #>))<#- h.endSymbol(c.pagingReqFields(), index, ".", ",") #>,
<# } else { -#>
        And(col.<#= item.goField #>, sq.IF(req.<#- c.SQIFCode(item) #>, sq.<# if(item.goType == "string"){#>Like<#}else {#>Equal<#}#>(req.<#= item.goField #>)))<#- h.endSymbol(c.pagingReqFields(), index, ".", ",") #>
<# } -#>
<# }) -#>
        OrderBy:[]sq.OrderBy{{col.ID, sq.DESC}},
	}
	if reply.Total, err = dep.mysql.Main.Count(ctx, &m.<#= v.structName #>{}, qb); err != nil {
	    return
    }
    if reply.Total == 0 {
        return
    }
    if err = dep.mysql.Main.QuerySlice(ctx, &list, qb.Paging(req.Page, req.PerPage)); err != nil {
        return
    }
    reply.List = sl.Map(list, func (v m.<#= v.structName #>) I<#- v.interfaceName #>.<#- c.AuthFieldSign() #>Paging<#- c.signName()#>ReplyItem {
    return I<#- v.interfaceName #>.<#- c.AuthFieldSign() #>Paging<#- c.signName()#>ReplyItem{
    <# c.pagingReplyFields().forEach(function (item) { -#>
        <#= c.padGoField(item) #>: v.<#= item.goField -#>,
    <# }) -#>
    }
    })
    return
}
<# } -#>     
<# } -#>
<# if(c.authField()) {-#>
func (dep DS) Auth<#- c.signName()#>(ctx context.Context, <#= h.firstLow(v.structName) #> m.<#= v.structName #>, <#- h.firstLow(c.authField().goField) #> <#- c.goType(c.authField(), "m.")  #>)(err error){
    if <#- c.goFieldIsZero(c.authField()) #> { return xerr.Reject(1, "不能为空", false)}
    if <#= h.firstLow(v.structName) #>.<#- c.authField().goField #> != <#- h.firstLow(c.authField().goField) #> {
        return xerr.Reject(1, "数据不属于你,刷新页面后重试", false)
    }
    return
}
func (dep DS) Auth<#- c.signName()#>ID(ctx context.Context, <#= c.primaryKeyGoVarType() #>, <#- h.firstLow(c.authField().goField) #> <#- c.goType(c.authField(), "m.")  #>)(err error){
    col := m.<#= v.structName #>{}.Column()
    var has bool
    if has, err = dep.mysql.Main.Has(ctx, &m.<#= v.structName #>{}, sq.QB{
        Where: sq.
        And(col.<#= c.primaryKeyGoField() #>, sq.Equal(<#= c.primaryKeyGoVar() #>)).
        And(col.<#- c.authField().goField #>, sq.Equal(<#- h.firstLow(c.authField().goField) #>)),
    }); err != nil {
        return
    }
    if has == false {
        return xerr.Reject(1, "数据不属于你,刷新页面后重试", false)
    }
    return
}
<# } -#>
`