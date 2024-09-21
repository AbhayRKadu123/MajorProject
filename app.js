require('dotenv').config()
console.log(process.env)

const express = require('express');
const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const mongoose = require('mongoose')
// const url = 'mongodb://127.0.0.1:27017/wanderlust';
const url=process.env.ATLASDB_URL;
const Listing = require('./Models/listing.js');
const path = require('path')
const wrapAsync = require('./utils/wrapAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const { error } = require('console');
const listing = require('./routes/listing.js');
const ReviewRouter = require('./routes/review.js');
const UserRoute=require("./routes/user.js")
const { stringify } = require('querystring');
const { randomBytes } = require('crypto');
const { object } = require('joi');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require("./Models/user.js");
const userrouter = require('./routes/user.js');
const  store= MongoStore.create({
    mongoUrl: url,
    crypto:{
        secret:process.env.secret
    } ,
    touchAfter:24*3600,// See below for details
  })
const session_option={
    store,
    secret: process.env.secret,   // Secret key to sign the session ID
  resave: false,             // Do not resave the session if unmodified
  saveUninitialized: false ,
  cookie: { 
    expires:Date.now()+24*60*60*1000,
    maxAge: 1800000 }
}

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(session(session_option));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs", ejsMate);
main().then(() => {
    console.log("connected")
})
    .catch((err) => {
        console.log(err)
    })
console.log(__dirname)
async function main() {
    await mongoose.connect(url);
}
app.listen(8080, () => {
    console.log("app is listening")
})
app.use((req,res,next)=>{
   
        res.locals.success=req.flash('success');


    
    
        res.locals.error=req.flash('error');
        res.locals.currentuser=req.user || null;
        console.log( res.locals.success)

        console.log( res.locals.error)
 
 
    next()
})
// app.get("/listings/search",(req,res)=>{
   
//     console.log(req.query)
//     res.send('data recieved')
// })
app.use("/listings", listing);

app.use("/listings/:id", ReviewRouter);
app.use("/user",userrouter);
app.get("/", wrapAsync(async (req, res) => {
    res.send("this is root")
}))

app.get("/demo",async(req,res)=>{
    let fakeuser=new User({
        email:"abhaykadu@gmail.com",
        username:"deltastudent"
    })

   const newuser= await User.register(fakeuser,'helloworld');
   res.send(newuser)
})


app.all("*", (req, res, next) => {
    next(new ExpressError(404, 'page not found'));
})

app.use((err, req, res, next) => {


    let { statuscode = 412, message } = err;
    res.render('error.ejs', { message })

})

// npm install multer-storage-cloudinary

