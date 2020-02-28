## API End-to-end testing 

### Demonstrates the following
- Setting up passport with multiple login strategires
    - Local Strategy
    - JWT Strategy
    - Beaer Strategy
- Setup Session storage and cookies
- Authorisation
- End-to-end testing

# How to run

`> npm i`

`> npm run dev`

OR 

`> node app.js`

Run with nodemon?  do install nodemon globally `npm install nodemon -g`

`nodemon index.js`

## Tests

### End-to-end (e2e) Tests

Make sure to install mochal globablly `npm install mocha -g`

Make sure to update DB settings in config (https://github.com/manjufy/api-e2e-testing/blob/master/config.js)

Make sure to create a database named `kljs-e2e-test` before running e2e tests.

`> npm run test:e2e`

## NodeJS Test tools/libs/frameworks.

- Use Mocha as test runner

Tools for testing in NodeJs

- **Mocha ☕** => Test Runner
- **Chai** 🥃 - Chai is a BDD and TDD assertion library
- **Sinon 🧙‍** - Unit testing framework, Sinon is a mocking library
- **Nock 🔮** - Use nock for external HTTP requests. Http mocking library
- **Mock-require 🎩** - With a single line of code, we can replace a module and mock-require will step in when some code attepts to import that module
- **Istanbul 🔭** - JavaScript code coverage tool that computes statement, line, function and branch coverage with module loader hooks to transparently add coverage when running tests.
- **SuperTest:**  Simple way to test APIs with just few lines of commands.
- **TAPE:** https://github.com/substack/tape => Test Runner
- **RITEWay:** https://github.com/ericelliott/riteway
- **AVA:** https://github.com/avajs/ava

Load Testing

- https://locust.io/

## Further improvements

- Use Session to authenticate and persist the session in either Cookie or Session storage
- Use redis as a session storage

### References

http://www.passportjs.org/docs/logout/

https://expressjs.com/
