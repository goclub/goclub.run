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
<# c.createFields().forEach(function (item) { -#>
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
`
