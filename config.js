const env = process.env.NODE_ENV || 'development';
const dbConnection = (env) => ({
    port: 3306,
    host: '127.0.0.1',
    user: 'root',
    password: 'manju2018',
    database: `formula1`,
    multipleStatements: true,
    timezone: 'utc',
})

module.exports = {
    env,
    app: {
        port: 3000
      },
      db: function () {
        switch(env) {
            case 'production':
                return {
                    ...dbConnection('test'),
                    host: 'prodHost',
                }
            case 'development':
            case 'test':        
                return {
                    ...dbConnection('test'),
                }
        }
    }()
}
