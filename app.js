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
const promise = require('bluebird');
const fs = promise.promisifyAll(require('fs'));
const app = express()

const sql = require('./common/sql')
const config = require('./config')
const userModel = require('./models/users')
const auth = require('./common/auth')
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

const SECRET = 'nomnomnom'

// Bearer strategy to authenticate endpoints with bearer
passport.use(new BearerStrategy(async (token, done) => {
    try {
        const { user } = jwtSimple.decode(token, SECRET)
        const newUser = await userModel.getByEmail(user.email)

        if (newUser.email === user.email) {
            return done(null, user)
        }
    } catch (error) {
        done(null, false)
    }
}))

// JWT strategy to authenticate with jwt token
passport.use(new JWTStrategy({
    jwtFromRequest: pass_jwt_extract.fromAuthHeaderWithScheme('jwt'),
    secretOrKey: SECRET }, async (payload, done) => {
    // find user from DB if needed
    const user = await userModel.login(payload.email, payload.password)
    console.log('User', user)
    if (user) {
        return done (null, user)
    }

    return done(null, false);
}))

// Local strategy to authenticate with username and password
passport.use(new LocalStrategy(
    { usernameField: 'email' }, // passport uses username and password authenticate user, however our app uses email, we alias it here
    async (email, password, done) => {
    const user = await userModel.login(email, password)

    if (user) {
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

passport.deserializeUser(async (id, done) => {
    // The user id passport saved in the session file store is: ${id}
    const user = await userModel.getById(id)
    if (user) {
        return done(null, user)
    }

    return done(null, false)
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

app.post('/api/auth/login-bearer', async (req, res) => {
    // make a call to DB, get the user based on username,password.
    const user = await userModel.login(req.body.email, req.body.password)
    console.log(user)
    if (user) {
        return res.send({
            token: jwtSimple.encode({ user }, SECRET)
        })
    }

    return res.status(401).send('Unauthenticated')
})

app.post('/api/auth/login-jwt', async (req, res) => {
    // make a call to DB, get the user based on username,password.
    const user = await userModel.login(req.body.email, req.body.password)

    if (user) {
        return res.send({
            token: jwt.sign({...user}, SECRET, { expiresIn: '1d' })
        })
    }

    return res.status(401).send('Unauthenticated')
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

app.post('/api/users', auth.authorise('USERS', ['ADMIN', 'SELLER']), async(req, res) => {
    if(req.isAuthenticated()) {
        const result = await userModel.upsert(req.body)
        return res.status(200).json(result)
    }

    res.status(401).send('Unauthenticated')
})

app.get('/api/todos-local', (req, res) => {
    if(req.isAuthenticated()) {
        return res.json([
            {
                id: 1,
                todo: 'Test'
            },
            {
                id: 2,
                todo: 'Test'
            }
        ])
    } 

    res.status(401).send('Unauthenticated')
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
app.get('/api/todos-jwt', passport.authenticate('JWT', { session: false }), (req, res) => {
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
    if (process.env.NODE_ENV !== 'test') {
        throw Error(`Obstruction of justice!`)
    }

    return promise.resolve()
        .then(() => {
            return fs.readdirAsync(`${__dirname}/sql/tables`)
        })
        .then(function (files) {
            return promise.each(files, function (file) {
                if (file.indexOf('.sql') == -1) return

                return fs.readFileAsync(`${__dirname}/sql/tables/${file}`, 'utf8')
                    .then((text) => {
                        return sql.kraw(text.replace(/\{0\}/g,config.db.database)).then()
                    })
            })
        })
        .then(function () {
            return fs.readdirAsync(`${__dirname}/sql/seed`)
        })
        .then(function (files) {
            return promise.each(files, function (file) {
                if (file.indexOf('.sql') == -1) return

                return fs.readFileAsync(`${__dirname}/sql/seed/${file}`, 'utf8')
                    .then((text) => {
                        return sql.kraw(text.replace(/\{0\}/g,config.db.database)).then()
                    })
            })
        })
        .then(() => res.send('DONE!'))
})

app.get('/api', (req, res) => res.send('Node+Express+Passport+Mocha+Superagent example'))

/*************
 * </ROUTES> 
 *************/

app.set('port', process.env.PORT || config.app.port);
app.listen(process.env.PORT || config.app.port, () => console.log('Listening on port 3000'))

// TODO: must export this to be able to perform integration and end-to-end tests
module.exports = app