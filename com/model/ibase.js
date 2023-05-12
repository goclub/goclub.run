export default `
package I<#- v.interfaceName #>
type DS interface {
    coreDS<#- c.signName()#>
}
`