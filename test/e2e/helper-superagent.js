const server = require('../../app')
const endpoint = `http://localhost:${server.get('port')}`;
// Login with Super agent
exports.loginWithSA = (agent, email = 'manju@manju.com', password = 'abc123') => {
        return agent
                .post(`${endpoint}/api/auth/login-local`)
                .send({
                    email,
                    password,
                })
}

exports.server = server
exports.superAgent = require('superagent')
exports.endpoint = endpoint