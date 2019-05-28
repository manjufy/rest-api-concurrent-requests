const env = process.env.NODE_ENV || 'development';
module.exports = {
    env,
    app: {
        port: 3000
      },
      db: () => {
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
    }
}

const dbConnection = (env) => ({
    port: 3306,
    host: '127.0.0.1',
    user: 'root',
    password: 'manju2018',
    database: `kljs-e2e-${env}`, // kljs-e2e-{dev|test|prod}
    multipleStatements: true,
    timezone: 'utc',
})
