// Package m Generate by https://goclub.run/?k=model
package m

import (
	sq "github.com/goclub/sql"
)

// IDUser ID别名
type IDUser uint64

func NewIDUser(id uint64) IDUser {
	return IDUser(id)
}
func (id IDUser) Uint64() uint64 {
	return uint64(id)
}

type TableUser struct {
	sq.SoftDeleteTime
}

// TableName 给 TableName 加上指针 * 能避免 db.InsertModel(user) 这种错误， 应当使用 db.InsertModel(&user) 或
func (*TableUser) TableName() string { return "user" }

type User struct {
	ID     IDUser `db:"id" sq:"ignoreInsert|ignoreUpdate"`
	Mobile string `db:"mobile"`
	TableUser
	sq.CreateTimeUpdateTime
	sq.DefaultLifeCycle
}

// AfterInsert 创建后自增字段赋值处理
func (v *User) AfterInsert(result sq.Result) error {
	id, err := result.LastInsertUint64Id()
	if err != nil {
		return err
	}
	v.ID = IDUser(id)
	return nil
}

func (v *TableUser) Column() (col struct {
	ID         sq.Column
	Mobile     sq.Column
	CreateTime sq.Column
	UpdateTime sq.Column
}) {
	col.ID = "id"
	col.Mobile = "mobile"
	col.CreateTime = "create_time"
	col.UpdateTime = "update_time"
	return
}
