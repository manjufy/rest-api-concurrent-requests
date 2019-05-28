const chai = require('chai')
const expect = chai.expect
const server = require('../../app')

const helper = require('./helper-superagent')
const superAgent = helper.superAgent
const requestAgent = superAgent.agent(server)

const apiUrl = helper.endpoint
/**
 * Synchronous code
 * When testing synchronous code, omit the callback and Mocha will automatically continue on to the next test.
 */

describe('#Users With Superagent Login', () => {
    // before hook
    before(() => {
        return helper.loginWithSA(requestAgent) //helper.loginWithSA(requestAgent, newUser, newPassword)
    })

    it('admin should be able to access todos', (done) => {
        return requestAgent
                .get(`${apiUrl}/api/todos-local`)
                .end((error, res) => {
                    expect(res.statusCode).to.be.equal(200)
                    done()
                })
    })
});
