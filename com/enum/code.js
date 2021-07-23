export default `
// Generate by https://t.goclub.run
// ---------------------- DO NOT EDIT (Begin) ----------------------
// Source enums:
// <#- JSON.stringify(v) #>
type <#= v.name #> <#= v.type #>
// Create <#= v.name #> by <#= v.type #>
func New<#= v.name #>(v <#= v.type #>)(<#= firstLetterToLowerCase(v.name) #> <#= v.name #>, err error) {
  <#= firstLetterToLowerCase(v.name) #> = <#= v.name #>(v)
  err = <#= firstLetterToLowerCase(v.name) #>.Validator()
  return
}
// return <#= v.name #> basic types
func (v <#= v.name #>) <#= toTitle(v.type) #> () <#= v.type #> { return <#= v.type #>(v)}
// Example: if <#= firstLetterToLowerCase(v.name) #> == <#= firstLetterToLowerCase(v.name) #>.Enum().xxx {...}
func (<#= v.name #>) Enum() (e struct {
<# v.items.forEach(function (item) { -#>
  <#= item.field.padEnd(maxItemFieldLen) #> <#= v.name #>
<# }) -#>
}){
  return Enum<#= v.name #>()
}
// Example: if <#= firstLetterToLowerCase(v.name) #> == Enum<#= v.name #>().xxx {...}
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
// Type safe match of all values, likeness switch
func (v <#= v.name #>) Match(
<# v.items.forEach(function (item) { -#>
  <#= item.field #> func(_ struct{<#= item.field #> bool}) error#>,
<# }) -#>
) error {
  e := v.Enum()
  switch v {
  default:
    return fmt.Errorf("<#= v.name #> can not be %s", v)
<# v.items.forEach(function (item) { -#>
  case e.<#= item.field #>:
    return <#= item.field #>(struct{ <#= item.field #> bool } {})
<# }) -#>
  }
}
// Verify data
func (v <#= v.name #>) Validator() error {
    return v.Match(
  <# v.items.forEach(function (item) { -#>
    func(_ struct{<#= item.field #> bool}) error {return nil} -#>,
  <# }) -#>)
}
// ---------------------- DO NOT EDIT (End) ----------------------
`