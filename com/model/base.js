export default `package <#- v.interfaceName #>
func NewDS(
	config *Conf.Config,
	log Logger.Logger,
	sentry *Sentry.Sentry,
	redis *ConnectRedis.Client,
	mysql *connectMysql.Client,
) (ds IAccount.DS, err error) {
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
	redis  *ConnectRedis.Client
	mysql  *connectMysql.Client
}
`