if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express');
const engine = require('ejs-mate')
const methodOverride = require('method-override')
const app = express();
const port = 3000;
const path = require('path');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const session = require('express-session')
const flash = require('connect-flash')
const Project = require('./models/leedprojectmodel');
const ExpressError = require('./utils/ExpressError')
const projectsRouter = require("./routers/projects")
const reviewRouter = require('./routers/reviews')
const usersRouter = require('./routers/users')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('./models/user')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const dbUrl = process.env.MONGODBURL || 'mongodb://localhost:27017/leedproject'
const secret = process.env.CLOUDINARY_SECRET || 'it is a secret'
const MongoStore = require('connect-mongo');


mongoose.connect(dbUrl)
    .then(res => {
        console.log('Successfully connected!')
    })
    .catch(err => {
        console.log('Failed to connect' + `${err}`)
    })

app.engine('ejs', engine);

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(methodOverride('_method'))
app.use(mongoSanitize())    //stop mongo injection. Prevent use {'gt':''} etc.

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 3600
})

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
    name: 'sess',
    secret: secret,
    store: store,                 //define where the sessions are stored
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,           //a bit security setting
        // secure:true,
        expires: Date.now() + 1000 * 7 * 24 * 60 * 60,
        maxAge: 1000 * 7 * 24 * 60 * 60
    }
}
app.use(session(sessionConfig))
app.use(flash())
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",

];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dhicnpupu/",
                "https://images.unsplash.com/",
                "https://source.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');  // do not need to pass anything to the ejs
    res.locals.error = req.flash('error');
    next()
})


app.use(express.static('public'))

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.set('public', path.join(__dirname, 'public'))



//register

app.get('/', (req, res) => {
    console.log(req.query)
    res.render('home.ejs')
})
app.use('/', usersRouter)

//projects 
app.use('/projects', projectsRouter)

//reviews 
app.use('/projects/:id/reviews', reviewRouter)



app.all('*', (req, res, next) => {
    //app.all   a special routing method used to load middleware functions at a path for all HTTP request methods.
    //Middleware functions are functions that take an extra argument, next along with req and res which is used to invoke the next middleware function.
    const err = new ExpressError('Page not found', 404)
    next(err)
})

app.use((err, req, res, next) => {
    if (!err.message) {
        err.message = 'Something Went Wrong'
    }
    if (!err.statusCode) {
        err.statusCode = '500'
    }
    res.render('error', { err })

})
//app.use Mounts the specified middleware function or functions at the specified path: the middleware function is executed when the base of the requested path matches path.



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

