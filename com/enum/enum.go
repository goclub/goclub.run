package m

// You can change package name

// LogKind Generate by https://goclub.run/?k=enum
// ---------------------- DO NOT EDIT (Begin) ----------------------
import (
	"fmt"
	xerr "github.com/goclub/error"
)

// LogKind
// Source enums:
// {"name":"LogKind","type":"uint8","items":[{"field":"Info","value":"1","tailed":", "},{"field":"Danger","value":"2"}]}
type LogKind uint8

// NewLogKind Create LogKind by uint8
func NewLogKind(v uint8) (logKind LogKind, err error) {
	logKind = LogKind(v)
	err = logKind.Validator()
	return
}

// Uint8 return LogKind basic types
func (v LogKind) Uint8() uint8 { return uint8(v) }

// EnumLogKind Example: if logKind == EnumLogKind().xxx {...}
func EnumLogKind() (e struct {
	Info   LogKind
	Danger LogKind
}) {
	e.Info = 1
	e.Danger = 2
	return
}
func EnumLogKindExampleSwitch() {
	_ = `
switch info, danger := m.EnumLogKindSwitch(); v {
case info.Info:
    // @TODO write some code
case danger.Danger:
    // @TODO write some code
default:
    err = xerr.New(fmt.Sprintf("LogKind can not be %v", v))
    return
}
`
}

// EnumLogKindSwitch safe switch of all values
// example: m.EnumLogKindExampleSwitch()
func EnumLogKindSwitch() (
	info struct{ Info LogKind },
	danger struct{ Danger LogKind },
) {
	e := EnumLogKind()
	info.Info = e.Info
	danger.Danger = e.Danger
	return
}

// Validator Verify data
func (v LogKind) Validator(custom ...error) error {
	outError := xerr.New(fmt.Sprintf("LogKind can not be %v", v))
	if len(custom) != 0 {
		outError = custom[0]
	}
	switch info, danger := EnumLogKindSwitch(); v {
	case info.Info:
	case danger.Danger:
	default:
		return outError
	}
	return nil
}

// ---------------------- DO NOT EDIT (End) ----------------------
