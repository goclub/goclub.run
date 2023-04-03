export default `
func (dep DS) Create<#- c.signName()#>(ctx context.Context, req I<#- v.interfaceName #>.Create<#- c.signName()#>Request) (<#= h.firstLow(v.structName) #> m.<#= v.structName #>, err error){
	<#- h.firstLow(v.structName) #> = &m.<#- v.structName #>{
<# c.createFields().forEach(function (item) { -#>
		<#= c.padGoField(item) #>: req.<#= item.goField -#>,
<# }) -#>
	}
	if _, err = dep.mysql.Main.InsertModel(ctx, &<#- h.firstLow(v.structName) #>, sq.QB{}); err != nil {
		return
	}
<# if(c.primaryKey()) {-#>
	<#= h.firstLow(v.structName) #>ID = <#- h.firstLow(v.structName) #>.<#- c.primaryKey().goField #>
<# } -#>
	return
}
<#if (c.needUpdate()) { -#>
func (dep DS) Update<#- c.signName()#>(ctx context.Context, req I<#- v.interfaceName #>.Update<#- c.signName()#>Request) (err error){
	col := m.Table<#- v.structName#>{}.Column()
	var updateData = map[sq.Column]interface{}{
<# c.updateFields().forEach(function (item) { -#>
		col.<#= c.padGoField(item) #>: req.<#= item.goField -#>,
<# }) -#>
	}
	if _, err = dep.mysql.Main.Update(ctx, sq.QB{
		From:  &m.Table<#- v.structName#>{},
		Set:   sq.SetMap(updateData),
		Where: <#- c.primaryKeyGoSQLWhereCode(4, "req.") #>,
		Limit: 1,
	}); err != nil {
		return
	}
	return
}
<# }-#>
func (dep DS) <#- v.structName #>s(ctx context.Context) (list []m.<#- v.structName#>, err error) {
	col := m.Table<#- v.structName#>{}.Column()
	err = dep.mysql.Main.QuerySlice(ctx, &list, sq.QB{
		From:			&m.Table<#- v.structName#>{},
		WhereAllowEmpty: true,
	})
	if err != nil {
		return
	}
	return
}
func (dep DS) <#- c.signName()#>(ctx context.Context, <#= c.primaryKeyGoVarType() #>) (<#= h.firstLow(v.structName) #> m.<#= v.structName #>, has<#= v.structName #> bool, err error)
	col := m.<#= v.structName #>{}.Column()
	if has<#= v.structName #>, err = dep.mysql.Main.Query(ctx, &<#= h.firstLow(v.structName) #>, sq.QB{
		Where:  <#= c.primaryKeyGoSQLWhereCode() #>),
	}); err != nil {
		return
	}
	return
}
func (dep DS) Must<#- c.signName()#>(ctx context.Context, <#= c.primaryKeyGoVarType() #>) (<#= h.firstLow(v.structName) #> m.<#= v.structName #>, err error)
	var has bool
	if has , err = dep.<#- c.signName()#>(ctx, <#= c.primaryKeyGoVar() #>); err != nil {
		return
	}
	if has == false {
		err = xerr.Reject(RejectCode.BaseDataNotFound, "", true)
		return
	}
	return
}
<# if (c.needPaging()) { -#>
	func (dep DS) Paging(ctx context.Context, req I<#- v.interfaceName #>.Paging<#- c.signName()#>Request) (list []m.<#= v.structName #>, total uint64, err error){
	var list []m.<#= v.structName #>
	col := m.<#= v.structName #>{}.Column()
	var qb = sq.QB{
	    Where:
<# c.pagingReqFields().forEach(function (item, index) { -#>
        And(col.<#= item.goField #>, sq.IF(req.<#- c.SQIFCode(item) #>, sq.<# if(item.goType == "string"){#>Like<#}else {#>Equal<#}#>(req.<#= item.goField #>)))<#- h.endSymbol(c.pagingReqFields(), index, ".", ",") #>
<# }) -#>
        OrderBy:[]sq.OrderBy{{col.ID, sq.DESC}}
	}
	if total, err = dep.mysql.Main.Count(ctx, &m.<#= v.structName #>{}, qb); err != nil {
	    return
    }
    if total == 0 {
        return
    }
    if err = dep.mysql.Main.QuerySlice(ctx, &list, qb.Paging(req.Page, req.PerPage); err != nil {
        return
    }
    reply.List = sl.Map(list, func (v m.<#= v.structName #>) I<#- v.interfaceName #>.<#- v.interfaceName #>Paging<#- c.signName()#>.ReplyItem {
<# c.pagingReplyFields().forEach(function (item) { -#>
        <#= c.padGoField(item) #>: v.<#= item.goField -#>,
<# }) -#>
    })
    return
}     
<# } -#>
`
