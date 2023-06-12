export default `
<# if (c.needPaging()) { -#>
func (dep View) Admin<#- v.structName #>(c *xhttp.Context, data interface{}) (err error) {
    var view *jet.Template
	if view, err = dep.set.GetTemplate("admin/<#- v.tableName #>.html"); err != nil {
		return
	}
	return view.Execute(c.Writer, nil, data)
}
<# } -#>
`