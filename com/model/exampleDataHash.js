export default {
    'Account': {
        "packageName": "m",
        "tableName": "account",
        "structName": "Account",
        "signName": "Account",
        "interfaceName": "Account",
        "softDelete": "sq.WithoutSoftDelete",
        "isAutoIncrement": true,
        "isIDTypeAlias": true,
        "customSoftDelete": {
            "SoftDeleteWhere": "return sq.Raw{\"`delete_time` IS NULL\", nil}",
            "SoftDeleteSet": "return sq.Raw{\"`delete_time` = ?\" ,[]interface{}{time.Now()}}"
        },
        "fieldCreateUpdate": "无",
        "fields": [
            {
                "isPrimaryKey": true,
                "column": "id",
                "goType": "uint64",
                "goField": "ID",
                "isCreate": false,
                "isUpdate": false,
                "pagingReply": true
            },
            {
                "isPrimaryKey": false,
                "column": "platform_kind",
                "goType": "custom",
                "goField": "PlatformKind",
                "goTypeCustom": "PlatformKind",
                "isCreate": true,
                "isUpdate": false,
                "pagingReq": true,
                "pagingReply": true
            },
            {
                "isPrimaryKey": false,
                "column": "unionid",
                "goType": "string",
                "goField": "Unionid",
                "isCreate": true,
                "isUpdate": false,
                "pagingReq": true,
                "pagingReply": true
            },
            {
                "isPrimaryKey": false,
                "column": "create_time",
                "goType": "time.Time",
                "goField": "CreateTime",
                "isCreate": false,
                "isUpdate": false
            }
        ]
    },
    'Platform': {
        "packageName": "m",
        "tableName": "platform",
        "structName": "Platform",
        "signName": "Platform",
        "interfaceName": "Account",
        "softDelete": "sq.WithoutSoftDelete",
        "isAutoIncrement": false,
        "isIDTypeAlias": true,
        "customSoftDelete": {
            "SoftDeleteWhere": "return sq.Raw{\"`delete_time` IS NULL\", nil}",
            "SoftDeleteSet": "return sq.Raw{\"`delete_time` = ?\" ,[]interface{}{time.Now()}}"
        },
        "fieldCreateUpdate": "sq.CreateTimeUpdateTime",
        "fields": [
            {
                "isPrimaryKey": true,
                "column": "id",
                "goType": "string",
                "goField": "ID",
                "isCreate": true,
                "isUpdate": false
            },
            {
                "isPrimaryKey": false,
                "column": "title",
                "goType": "string",
                "goField": "Title",
                "goTypeCustom": "",
                "isCreate": true,
                "isUpdate": true
            },
            {
                "isPrimaryKey": false,
                "column": "appid",
                "goType": "string",
                "goField": "AppID",
                "isCreate": true,
            },
            {
                "isPrimaryKey": false,
                "column": "app_secret",
                "goType": "string",
                "goField": "AppSecret",
                "isCreate": true,
                "isUpdate": true,
            },
            {
                "isPrimaryKey": false,
                "column": "kind",
                "goType": "custom",
                "goField": "Kind",
                "goTypeCustom": "PlatformKind",
                "isCreate": true,
            }
        ]
    },
    'AccountOpen': {
        "packageName": "m",
        "tableName": "account_open",
        "structName": "AccountOpen",
        "signName": "Open",
        "interfaceName": "Account",
        "softDelete": "sq.WithoutSoftDelete",
        "isAutoIncrement": false,
        "isIDTypeAlias": false,
        "customSoftDelete": {
            "SoftDeleteWhere": "return sq.Raw{\"`delete_time` IS NULL\", nil}",
            "SoftDeleteSet": "return sq.Raw{\"`delete_time` = ?\" ,[]interface{}{time.Now()}}"
        },
        "fieldCreateUpdate": "无",
        "fields": [
            {
                "isPrimaryKey": true,
                "column": "account_id",
                "goType": "custom",
                "goField": "AccountID",
                "isCreate": true,
                "goTypeCustom": "IDAccount"
            },
            {
                "isPrimaryKey": true,
                "column": "platform_id",
                "goType": "custom",
                "goField": "PlatformID",
                "goTypeCustom": "IDPlatform",
                "isCreate": true
            },
            {
                "isPrimaryKey": false,
                "column": "openid",
                "goType": "string",
                "goField": "Openid",
                "isCreate": true
            },
            {
                "isPrimaryKey": false,
                "column": "create_time",
                "goType": "time.Time",
                "goField": "CreateTime"
            }
        ]
    },
    'TinyURL': {
        "packageName": "m",
        "tableName": "tiny_url",
        "structName": "TinyURL",
        "signName": "URL",
        "interfaceName": "TinyURL",
        "isAutoIncrement": true,
        "isIDTypeAlias": true,
        "dir": {
            "sql": "",
            "module": "tiny_url",
            "tpl": "",
            "handle": "",
            "view": ""
        },
        "softDelete": "sq.WithoutSoftDelete",
        "codeStyle": {
            "camelCaseID": "ID"
        },
        "customSoftDelete": {
            "SoftDeleteWhere": "",
            "SoftDeleteSet": ""
        },
        "fieldCreateUpdate": "",
        "fields": [
            {
                "isPrimaryKey": true,
                "column": "id",
                "goType": "uint64",
                "goField": "ID",
                "goTypeCustom": "ID",
                "pagingReply": true
            },
            {
                "isPrimaryKey": false,
                "column": "path",
                "goType": "string",
                "goField": "Path",
                "label": "短路径",
                "isCreate": true,
                "pagingReply": true,
                "pagingReq": true
            },
            {
                "isPrimaryKey": false,
                "column": "url",
                "goType": "string",
                "goField": "URL",
                "label": "目标地址",
                "isCreate": true,
                "isUpdate": true,
                "pagingReply": true,
                "pagingReq": true
            },
            {
                "isPrimaryKey": false,
                "column": "client_id",
                'isAuth': true,
                "goType": "custom",
                "goField": "ClientID",
                "goTypeCustom": "IDClient",
                "label": "客户账号",
                "isCreate": true,
                "pagingReply": true,
                "pagingReq": true
            },
            {
                "column": "create_time",
                "goType": "time.Time",
                "goField": "CreateTime",
                "label": "创建时间",
                "pagingReply": true,
                "pagingReq": true
            }
        ]
    },
}