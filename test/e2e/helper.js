const chai = require('chai');
const http = require('chai-http');
const server = require('../../app');
chai.use(http);
// Login with chai.request.agent
const admin = chai.request.agent(server);
const buyer = chai.request.agent(server);
const seller = chai.request.agent(server);
exports.login = () => {
    const users = {
        admin, // same as admin: admin
        buyer,
        seller
    }

    const dbInitStr = '/api/db-init'
    return admin.get(dbInitStr)
        .then(() => {
            // ADMIN
            return admin
                    .post('/api/auth/login-local')
                    .send({
                        'email': 'manju@manju.com',
                        'password': 'abc123'
                    })
        })
        .then(() => {
            // SELLER
            return seller
                .post('/api/auth/login-local')
                .send({
                    'email': 'micheal@manju.com',
                    'password': 'abc123'
                })
        })
        .then(() => {
            // BUYER
            return buyer
                .post('/api/auth/login-local')
                .send({
                    'email': 'seb@manju.com',
                    'password': 'abc123'
                })
        })
        .then(() => users)
}