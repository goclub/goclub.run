export default `
<#if (v.isNewInteface) { -#>
package <#- v.interfaceName #>
import sl "github.com/goclub/slice"
import sq "github.com/goclub/sql"
func NewDS(
	config *Conf.Config,
	log Logger.Logger,
	sentry *Sentry.Sentry,
	redis *ConnectRedis.Client,
	mysql *connectMysql.Client,
) (ds IAccount.DS, err error) {
	return &DS{
		config: config,
		log: log,
		mysql:  mysql,
		redis:  redis,
		sentry: sentry,
	}, nil
}

type DS struct {
	config *Conf.Config
	log Logger.Logger
	sentry *Sentry.Sentry
	redis  *ConnectRedis.Client
	mysql  *connectMysql.Client
}
<# }-#>
func (dep DS) Create<#- c.signName()#>(ctx context.Context, req I<#- v.interfaceName #>.Create<#- c.signName()#>Request) (<#= h.firstLow(v.structName) #> m.<#= v.structName #>, err error){
	<#- h.firstLow(v.structName) #> = m.<#- v.structName #>{
<# c.createFields().forEach(function (item) { -#>
		<#= c.padGoField(item) #>: req.<#= item.goField -#>,
<# }) -#>
	}
	if _, err = dep.mysql.Main.InsertModel(ctx, &<#- h.firstLow(v.structName) #>, sq.QB{}); err != nil {
		return
	}
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
func (dep DS) <#- c.signName(v.structName) #>s(ctx context.Context) (list []m.<#- v.structName#>, err error) {
	err = dep.mysql.Main.QuerySlice(ctx, &list, sq.QB{
		From:			&m.Table<#- v.structName#>{},
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
func (dep DS) Paging<#- c.signName()#>(ctx context.Context, req I<#- v.interfaceName #>.Paging<#- c.signName()#>Request) (reply I<#- v.interfaceName #>.Paging<#- c.signName()#>Reply, err error){
	col := m.<#= v.structName #>{}.Column()
	var list  []m.<#- v.structName#>
	var qb = sq.QB{
	    Where:sq.
<# c.pagingReqFields().forEach(function (item, index) { -#>
        And(col.<#= item.goField #>, sq.IF(req.<#- c.SQIFCode(item) #>, sq.<# if(item.goType == "string"){#>Like<#}else {#>Equal<#}#>(req.<#= item.goField #>)))<#- h.endSymbol(c.pagingReqFields(), index, ".", ",") #>
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
    reply.List = sl.Map(list, func (v m.<#= v.structName #>) I<#- v.interfaceName #>.Paging<#- c.signName()#>ReplyItem {
    return I<#- v.interfaceName #>.Paging<#- c.signName()#>ReplyItem{
    <# c.pagingReplyFields().forEach(function (item) { -#>
        <#= c.padGoField(item) #>: v.<#= item.goField -#>,
    <# }) -#>
    }
    })
    return
}     
<# } -#>`
