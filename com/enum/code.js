export default `package m
// You can change package name

// <#= v.name #> Generate by https://goclub.run/?k=enum
// ---------------------- DO NOT EDIT (Begin) ----------------------
import (
	xerr "github.com/goclub/error"
	"fmt"
)
// <#= v.name #>
// Source enums:
// <#- JSON.stringify(v) #>
type <#= v.name #> <#= v.type #>
// New<#= v.name #> Create <#= v.name #> by <#= v.type #>
func New<#= v.name #>(v <#= v.type #>)(<#= firstLetterToLowerCase(v.name) #> <#= v.name #>, err error) {
  <#= firstLetterToLowerCase(v.name) #> = <#= v.name #>(v)
  err = <#= firstLetterToLowerCase(v.name) #>.Validator()
  return
}
// <#= toTitle(v.type) #> return <#= v.name #> basic types
func (v <#= v.name #>) <#= toTitle(v.type) #> () <#= v.type #> { return <#= v.type #>(v)}

// Enum<#= v.name #> Example: if <#= firstLetterToLowerCase(v.name) #> == Enum<#= v.name #>().xxx {...}
func Enum<#= v.name #>() (e struct {
<# v.items.forEach(function (item) { -#>
  <#= item.field.padEnd(maxItemFieldLen) #> <#= v.name #>
<# }) -#>
}) {
<# v.items.forEach(function (item) { -#>
  e.<#= item.field.padEnd(maxItemFieldLen) #> = <#- govalue(v.type, item.value) #>
<# }) -#>
  return
}
// Enum<#= v.name #> safe switch of all values
func Enum<#= v.name #>Switch() (
<# v.items.forEach(function (item) { -#>
    <#= firstLetterToLowerCase(item.field) #> <#= v.name #>,
<# }) -#>
) {
    e := Enum<#= v.name #>()
    return <# v.items.forEach(function (item) { #>e.<#= item.field #><#=item.tailed#><# }) #>
} 
func exampleEnum<#= v.name #>Switch (v <#= v.name #>) (err error) {
    switch <# v.items.forEach(function (item) { -#><#= firstLetterToLowerCase(item.field) #><#= item.tailed #><# }) -#> := Enum<#= v.name #>Switch(); v {
    <# v.items.forEach(function (item) { -#>
    case <#= firstLetterToLowerCase(item.field) #>:
        // @TODO write some code
    <# }) -#>
    default:
        err = xerr.New(fmt.Sprintf("LogKind can not be %s", v))
        return
    }
    return
}
// Match Type safe match of all values, likeness switch
func (v <#= v.name #>) Match(
<# v.items.forEach(function (item) { -#>
  <#= item.field #> func(_ struct{<#= item.field #> bool}) ( err error)#>,
<# }) -#>
) error {
  e := Enum<#= v.name #>()
  switch v {
  default:
    return xerr.New(fmt.Sprintf("<#= v.name #> can not be %s", v))
<# v.items.forEach(function (item) { -#>
  case e.<#= item.field #>:
    return <#= item.field #>(struct{ <#= item.field #> bool } {})
<# }) -#>
  }
}
// Validator Verify data
func (v <#= v.name #>) Validator() error {
    return v.Match(
  <# v.items.forEach(function (item) { -#>
    func(_ struct{<#= item.field #> bool}) error {return nil} -#>,
  <# }) -#>)
}
// ---------------------- DO NOT EDIT (End) ----------------------
`