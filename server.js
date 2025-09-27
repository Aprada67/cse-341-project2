const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongodb = require('./data/database');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');

const port = process.env.PORT || 3000;

// Middleware CORS
app
.use(bodyParser.json())
.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
}))
// This is the basic express session({...}) initialization.
.use(passport.initialize())
// Init passport on every route call.
.use(passport.session())
// Allow passport to use "express-session".
use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Z-Key, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, OPTIONS'
    );
    next();
})
.use(cors({ methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']}))
.use(cors({ origin: '*'}))
.use('/', require('./routes/index'))

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
},
function(accesToken, refreshToken, profile, done) {
    // User.findOrCreate({ githubId: profileId }, function (err, user) {
    return done(null, profile)
    // });
}
));

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

app.get('/', (req, res) => { res.send(req.session.user !== undefined ? `Logged In as ${req.session.user.displayName}` : 'Logged Out')});

app.get('github/callback', passport.authenticate('github', {
    failureRedirect: '/api-docs', session: false}),
    (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
    });

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API Routes
app.use('/', require('./routes'));

// Database connection
mongodb.initDb((err) => {
    if (err) {
        console.log(err);
    }
    else {
        app.listen(port, () => { console.log(`Running on port ${port}`) });
    }
})
