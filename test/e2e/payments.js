const chai = require('chai');
const expect = chai.expect;
const helper = require('./helper-superagent')
const superAgent = helper.superAgent
const requestAgent = superAgent.agent(helper.server)

const apiUrl = helper.endpoint
describe('#Payments', () => {
    const payment = {
        user_id: 1234,
        order_id: '1234-567-x22234343',
        status: 'SUCCESS',
        amount: 100,
        transaction_id: 'T23232323'
    };

    /**
     * Here we try to create the same resource multiple times and we should have only one entry in the database
     * for the same user and rest of the calls should throw error and how you deal with the error is upto the application.
     * That is, you want to log the error in the application logs or in a db table.
     */

    it('should create a new payment record and reject the remaining requests', async () => {
        await requestAgent
                .post(`${apiUrl}/api/payments`)
                .send(payment)
                .then((res) => {
                    expect(res.statusCode).to.be.equal(200)
                })
            
        // for consecutive requests, we should get 400
        await requestAgent
        .post(`${apiUrl}/api/payments`)
        .send(payment)
        .then()
        .catch(error => {
            expect(error.status).to.be.equal(400)
        })

        await requestAgent
        .post(`${apiUrl}/api/payments`)
        .send(payment)
        .then()
        .catch(error => {
            expect(error.status).to.be.equal(400)
        })

        await requestAgent
        .post(`${apiUrl}/api/payments`)
        .send(payment)
        .then()
        .catch(error => {
            expect(error.status).to.be.equal(400)
        })
    })
});
