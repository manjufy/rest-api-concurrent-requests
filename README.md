### Node+Express+Passport: Session, Authentication, Authorization with passport

Demonstration of how to use Passport with Node and Express

- How to set up passport to authenticate
- How to set up session and cookies, and session storage
- How to setup local strategy to authenticate
- How to setup bearer to authorise an endpoint

# How to run

`> npm run dev`

OR 

`> node index.js`

Run with nodemon?  do install nodemon globally `npm install nodemon -g`

`nodemon index.js`

## Login

Use postman or curl or any http tool to call

- Call Call `POST /locahost:3000/login` endpint and get the access token (refer to index.js file to username/password)

<img src="https://github.com/manju16832003/node-express-session-passport/blob/master/images/login.png?raw=true">

## Authorisation

Try to access `GET /localhost:3000/todos` -> Endpoint returns Unauthorised as it requires Bearer token to access the endpoint

From the previous endpoint `POST /locahost:3000/login` -> Copy the token from the response and use it in the header request with `Authorisation: Bearer <token>`

```
app.get('/todos', passport.authenticate('bearer', { session: false }), (_, res) => {
```

<img src="https://github.com/manju16832003/node-express-session-passport/blob/master/images/login-unauthorised.png?raw=true">

<img src="https://github.com/manju16832003/node-express-session-passport/blob/master/images/login-authorised.png?raw=true">


### Cookie

Cookie size is 4KB (4093 bytes)

48 Cookies per domain ( do not exceed 50 Cookies per domain)

### Session

*Browsers will automatically save/send the session id and send it in each request to the server; however, cURL doesn’t automatically save our session ID*

```
    app.use(session({
        name: 'manju.cookie', // optional; if not provided, cookie name would be connect.sid
        genid: (req) => {
            console.log('Session middleware', req.sessionID)
            return uuid() // use UUID's for session id
        },
        secret: 'nomnomnom',
        resave: false,
        saveUninitialized: true
    }))
```

<img src="https://github.com/manju16832003/node-express-session-passport/blob/master/images/session.png?raw=true"/>

*Store session in a FileStorage*

- If we use `session-file-store` package, it would create a `sessions` folder in the root directory
- Each time we create a new session, nodemon will restart the server and causing to create a new session
- To avoid this issie, we tell the nodemon to ignore session folder `nodemon --ignore sessions/ server.js`


## Passport serialise and deserialise explained

https://stackoverflow.com/questions/27637609/understanding-passport-serialize-deserialize

## Further improvements

- Use Session to authenticate and persist the session in either Cookie or Session storage
- Use redis as a session storage

### References

https://scotch.io/tutorials/easy-node-authentication-setup-and-local

https://codeburst.io/node-js-by-example-part-3-31a29f5d7e9c

https://blog.risingstack.com/node-hero-node-js-authentication-passport-js/


*https://medium.com/@evangow/server-authentication-basics-express-sessions-passport-and-curl-359b7456003d

https://github.com/passport/express-4.x-facebook-example

https://appdividend.com/2017/12/21/simple-nodejs-authentication-system-using-passport/

https://medium.com/@tkssharma/authentication-using-passport-js-social-auth-with-node-js-1e1ec7086ded
