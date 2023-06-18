export default `package <#- v.interfaceName #>
import (
    "<#- c.dir().project #>/internal/<#- c.dir().module #>/interface"
    "<#- c.dir().project #>/internal/core/connect_mysql"
    "<#- c.dir().project #>/internal/core/connect_redis"
    "<#- c.dir().project #>/internal/core/sentry"
    "<#- c.dir().project #>/internal/core/conf"
)
func NewDS(
	config *Conf.Config,
	// log Logger.Logger,
	sentry *Sentry.Sentry,
	redis *ConnectRedis.Client,
	mysql *ConnectMysql.Client,
) (ds I<#- v.interfaceName #>.DS, err error) {
	return &DS{
		config: config,
		// log: log,
		mysql:  mysql,
		redis:  redis,
		sentry: sentry,
	}, nil
}

type DS struct {
	config *Conf.Config
	// log Logger.Logger
	sentry *Sentry.Sentry
	redis  *ConnectRedis.Client
	mysql  *ConnectMysql.Client
}
`