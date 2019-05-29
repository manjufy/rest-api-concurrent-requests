## API End-to-end testing 

### Demonstrates the following
- Setting up passport with multiple login strategires
    - Local Strategy
    - JWT Strategy
    - Beaer Strategy
- Setup Session storage and cookies
- Authorisation

# How to run

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

## Further improvements

- Use Session to authenticate and persist the session in either Cookie or Session storage
- Use redis as a session storage

### References

http://www.passportjs.org/docs/logout/

https://expressjs.com/
