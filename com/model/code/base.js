export default `package <#- v.interfaceName #>
func NewDS(
	config *Conf.Config,
	log Logger.Logger,
	sentry *Sentry.Sentry,
	redis *connectRedis.Client,
	mysql *connectMysql.Client,
) (ds I<#- v.interfaceName #>.DS, err error) {
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
	redis  *connectRedis.Client
	mysql  *connectMysql.Client
}
`