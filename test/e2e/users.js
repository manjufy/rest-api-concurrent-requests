const chai = require('chai');
const expect = chai.expect;
const helper = require('./helper');
let users

/**
 * Synchronous code
 * When testing synchronous code, omit the callback and Mocha will automatically continue on to the next test.
 */
describe.only('#Users', () => {
    // before hook
    before(() => {
        return helper.login()
                .then((res) => {
                    users = res
                })
    })

    describe('#ADMIN', () => {
        it('admin should return todos', () => {
            return users.admin.get('/api/todos-local')
                    .then((res) => {
                        expect(res.statusCode).to.be.equal(200)
                    })
        })
    
        
        it('admin should return todos', function () {
            // this.timeout(10000) // this does not work if we use arrow functions.
            return users.admin.get('/api/todos-local')
                    .then((res) => {
                        expect(res.statusCode).to.be.equal(200)
                    })
        })
    
        it('admin should logout', function () {
            // this.timeout(10000) // this does not work if we use arrow functions.
            return users.admin.get('/api/auth/logout-local')
                    .then((res) => {
                        expect(res.statusCode).to.be.equal(200)
                    })
        })
    
        it('admin should return todos', function () {
            // this.timeout(10000) // this does not work if we use arrow functions.
            return users.admin.get('/api/todos-local')
                    .then((res) => {
                        expect(res.statusCode).to.be.equal(403)
                    })
        })
    })

    it('pending test => should return all users');
    // it.only('exclusive tests');
    // it.skip('inclusive tests');
});

// Source: Mocha documentation
describe.skip('Retries', function() {
    // Retry all tests in this suite up to 4 times
    this.retries(4);
  
    beforeEach(function() {
      browser.get('http://www.yahoo.com');
    });
  
    it('should succeed on the 3rd try', function() {
      // Specify this test to only retry up to 2 times
      this.retries(2);
      expect($('.foo').isDisplayed()).to.eventually.be.true;
    });
});