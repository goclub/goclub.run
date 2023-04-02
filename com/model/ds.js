export default `
func (dep DS) <#- c.subModelName()#>Create(ctx context.Context, req I<#- v.interfaceName #>.<#- c.subModelName()#>CreateRequest) (<#= h.firstLow(v.structName) #> m.<#= v.structName #>, err error){
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

func (dep DS) <#- c.subModelName()#>Update(ctx context.Context, req I<#- v.interfaceName #>.<#- c.subModelName()#>UpdateRequest) (err error){
    col := m.Table<#- v.structName#>{}.Column()
    var updateData = map[sq.Column]interface{}{
<# c.updateFields().forEach(function (item) { -#>
        col.<#= c.padGoField(item) #>: req.<#= item.goField -#>,
<# }) -#>
    }
    if _, err = dep.mysql.Main.Update(ctx, sq.QB{
        From:  &m.Table<#- v.structName#>{},
        Set:   sq.SetMap(updateData),
        Where: sq.And(col.ID, sq.Equal(req.ID)),
        Limit: 1,
    }); err != nil {
        return
    }
    return
}
func (dep DS) <#- c.subModelName()#>List(ctx context.Context) (list []m.<#- v.structName#>, err error) {
    col := m.Table<#- v.structName#>{}.Column()
    err = dep.mysql.Main.QuerySlice(ctx, &list, sq.QB{
        From:            &m.Table<#- v.structName#>{},
        WhereAllowEmpty: true,
    })
    if err != nil {
        return
    }
    return
}
func (dep DS) Must<#- c.subModelName()#>(ctx context.Context, <#= h.firstLow(v.structName) #>ID m.ID<#= v.structName #>) (<#= h.firstLow(v.structName) #> m.<#= v.structName #>, err error)
	col := m.Table<#= v.structName #>{}.Column()
	var has bool
	if has, err = dep.mysql.Main.Query(ctx, &<#= h.firstLow(v.structName) #>, sq.QB{
		Where:  sq.And(col.ID, sq.Equal(<#= h.firstLow(v.structName) #>ID)),
	}); err != nil {
		return
	}
	if has == false {
		err = xerr.Reject(RejectCode.BaseDataNotFound, "", true)
		return
	}
	return
}
`
