const chai = require('chai');
const http = require('chai-http');
const server = require('../../app');
chai.use(http);
// Login with chai.request.agent
const admin = chai.request.agent(server);
const customer = chai.request.agent(server);
exports.login = () => {
    const users = {
        admin, // same as admin: admin
        customer,
    }

    const dbInitStr = '/db-init'
    return admin.get(dbInitStr)
        .then(() => {
            return admin
                    .post('/api/auth/login-local')
                    .send({
                        'email': 'manju@manju.com',
                        'password': 'abc123'
                    })
        })
        .then(() => {
            return customer
                .post('/api/auth/login-local')
                .send({
                    'email': 'customer@manju.com',
                    'password': 'abc123'
                })
        })
        .then(() => users)
}