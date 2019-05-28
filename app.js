const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const BearerStrategy = require('passport-http-bearer')
const JWTStrategy = require('passport-jwt').Strategy
const jwt = require('jsonwebtoken')
const jwtSimple = require('jwt-simple')
const pass_jwt_extract = require('passport-jwt').ExtractJwt;
const session = require('express-session')
const uuid = require('uuid')
const FileStore = require('session-file-store')(session)
const app = express()
const config = require('./config')
app.use(bodyParser.json())

// configure session middleware
/**
 * Create a session and store it in a cookie.
 * NOTE: Browsers will automatically save/send the session id and 
 * send it in each request to the server; 
 * however, cURL doesn’t automatically save our session ID
 * Following is used for passport-local strategy
 */
app.use(session({
    name: 'manju.cookie', // optional; if not provided, cookie name would be connect.sid
    genid: (req) => {
        /**
         * If there was no session created, we come here to create a session.
         * if session is already created, we won't come here again.
         */
        return uuid() // use UUID's for session id
    },
    store: new FileStore(), // creates a session folder and stores the session file in it
    secret: 'nomnomnom',
    resave: false,
    saveUninitialized: true
}))

app.use((req, res, next) => {
    // logger setup etc
    // console.log('SessionID', req.sessionID)
    next()
})

// Since we don't have persistence storage yet, lets just hard code this for now
const users = [
    { id: 1, email: 'manju@manju.com', password: 'abc123' }
]

const SECRET = 'nomnomnom'

// Bearer strategy to authenticate endpoints with bearer
passport.use(new BearerStrategy((token, done) => {
    try {
        const { user } = jwtSimple.decode(token, SECRET)
        if (users[0].email === user.email) {
            return done(null, user)
        }
    } catch (error) {
        done(null, false)
    }
}))

// JWT strategy to authenticate with jwt token
passport.use(new JWTStrategy({
    jwtFromRequest: pass_jwt_extract.fromAuthHeaderWithScheme('jwt'),
    secretOrKey: SECRET }, (payload, done) => {
    // find user from DB if needed
    const user = users[0]
    if (payload.email === user.email && payload.password === user.password) {
        return done (null, user)
    }

    return done(null, false);
}))

// Local strategy to authenticate with username and password
passport.use(new LocalStrategy(
    { usernameField: 'email' }, // passport uses username and password authenticate user, however our app uses email, we alias it here
    (email, password, done) => {
        // here we can make a call to DB to find the user based on username, password.
        // for now, lets use the hardcode ones
        const user = users[0]

    if (email === user.email && password === user.password) {
        // return done(null, jwt.encode({ user }, SECRET))
        return done(null, user)
    }

    return done(null, false)
}))

/**
 * tell passport how to serialise the user
 * Serialises user into session and determines which data of the user object should be stored in session.
 */
passport.serializeUser((user, done) => {
    // Inside serialise cb. User id is stored to the session file store here
    return done(null, user.id) // store the user.id into session
})

passport.deserializeUser((id, done) => {
    // The user id passport saved in the session file store is: ${id}
    const user = users[0].id === id ? users[0] : false; 
    return done(null, user)
})

// tell application to use passport as middleware
// configure these only after express-session and session-file-store
app.use(passport.initialize())
app.use(passport.session())

/*************
 * <ROUTES> 
 *************/
/**
 * passport.authenticate automatically invokes, req.login method http://www.passportjs.org/docs/login/
 */
app.post('/api/auth/login-local', passport.authenticate('local'), (req, res) => {
    const user = req.user
    //  ${JSON.stringify(req.session.passport)} => { "user" :1 } => {"id":1,"email":"manju@manju.com","password":"abc123"}
    //  req.user: ${JSON.stringify(req.user)}
    res.send({
        message: "successfully logged in"
    })
})

app.post('/api/auth/login-bearer', (req, res) => {
    // make a call to DB, get the user based on username,password.
    const user = users[0]
    if (req.body.email === user.email && req.body.password === user.password) {
        return res.send({
            token: jwtSimple.encode({ user }, SECRET)
        })
    }

    return res.status(500).send('Internal Server error')
})

app.post('/api/auth/login-jwt', (req, res) => {
    // make a call to DB, get the user based on username,password.
    const user = users[0]
    if (req.body.email === user.email && req.body.password === user.password) {
        return res.send({
            token: jwt.sign(user, SECRET, { expiresIn: '1d' })
        })
    }

    return res.status(500).send('Internal Server error')
})

app.get('/api/auth/logout-local', (req, res) => {
    req.logout()
    req.session.destroy();
    res.send({
        message: "successfully logged out"
    })
})

/**
 * Authorised endpoints. Must be logged into access this endpoint (LocalStrategy)
 */
app.get('/api/todos-local', (req, res) => {
    if(req.isAuthenticated()) {
        res.json([
            {
                id: 1,
                todo: 'Test'
            },
            {
                id: 2,
                todo: 'Test'
            }
        ])
    } else {
      res.status(403).send('Forbidden')
    }
})

/**
 * Authorised endpoint. Must use `Bear Token` to access the following endpoint.
 * POST http://localhost:3000/login-bearer {username: 'username', password: 'password'} - To get JWT token
 * GET http://localhost:3000/todos-bearer -H "Authorization: Bear <token>"
 */
app.get('/api/todos-bearer', passport.authenticate('bearer', { session: false }), (_, res) => {
    res.json([
        {
            id: 1,
            todo: 'Test'
        },
        {
            id: 2,
            todo: 'Test'
        }
    ])
})

/**
 * Authorised endpoint. Must use `JWT Token` to access the following endpoint.
 * POST http://localhost:3000/login-jwt {username: 'username', password: 'password'} - To get JWT token
 * GET http://localhost:3000/todos-jwt -H "Authorization: jwt <token>"
 */
app.get('/api/todos-jwt', passport.authenticate('JWT', { session: false }), (_, res) => {
    res.json([
        {
            id: 1,
            todo: 'Test'
        },
        {
            id: 2,
            todo: 'Test'
        }
    ])
})

// only do this for NODE_ENV=test.
app.get('/api/db-init', (req, res) => {
    console.log('setting up db tables')
    res.send('DONE!')
})

app.get('/api', (req, res) => res.send('Node Express Passport Session example'))

/*************
 * </ROUTES> 
 *************/

app.set('port', process.env.PORT || config.app.port);
app.listen(process.env.PORT || config.app.port, () => console.log('Listening on port 3000'))

// TODO: must export this to be able to perform integration and end-to-end tests
module.exports = app