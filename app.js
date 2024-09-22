if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
    console.log('Environment variables loaded from .env');
}

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./Models/user');
const listing = require('./routes/listing');
const ReviewRouter = require('./routes/review');
const userrouter = require('./routes/user');
const wrapAsync = require('./utils/wrapAsync');
const ExpressError = require('./utils/ExpressError');

const app = express();
const url = process.env.ATLASDB_URL;
const secret = process.env.secret || 'fallback-secret'; // Fallback if not provided

// Middleware
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Session Configuration
const store = MongoStore.create({
    mongoUrl: url,
    crypto: { secret },
    touchAfter: 24 * 3600 // 24 hours
});
const session_option = {
    store,
    secret,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        expires: Date.now() + 24 * 60 * 60 * 1000, 
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true 
    }
};
app.use(session(session_option));
app.use(flash());

// Passport Configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to handle flash messages and user
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentuser = req.user || null;
    next();
});

app.get("/",(req,res)=>{
    res.redirect("/listings")
})
// Routes
app.use('/listings', listing);
app.use('/listings/:id', ReviewRouter);
app.use('/user', userrouter);




// Error handling
app.all('*', (req, res, next) => {
    next(new ExpressError(404, 'Page not found'));
});

app.use((err, req, res, next) => {
    const { statuscode = 500, message = 'Something went wrong!' } = err;
    res.status(statuscode).render('error.ejs', { message });
});

// Database connection
async function main() {
    try {
        await mongoose.connect(url);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
}
main();

app.listen(8080, () => {
    console.log('App is listening on port 8080');
});