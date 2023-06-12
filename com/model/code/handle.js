export default `package Http
func (dep Server) managerHandle(managerGroup *xhttp.Group) {
<# if (c.needPaging()) { -#>
    managerGroup.HandleFunc(xhttp.Route{xhttp.GET, "/admin/<#- v.tableName #>"}, func(c *xhttp.Context) (err error) {
        ctx := c.Request.Context()
        var req I<#- v.interfaceName #>.Paging<#- c.signName() #>Request
        if err = c.UnmarshalJSONFromQuery("json", &req); err != nil {  return }
        var reply I<#- v.interfaceName #>.Paging<#- c.signName() #>Reply
		    if reply, err = dep.<#- v.interfaceName #>Biz.Paging<#- c.signName() #>(ctx, req); err != nil {
    			return
	    	}
		    return dep.View.Admin<#- v.structName #>(c, reply)
	})
<# } -#>
}
`