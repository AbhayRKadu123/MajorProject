const express=require('express');
const userrouter=express.Router({mergeParams:true});
const wrapAsync=require('../utils/wrapAsync');
const ExpressError=require('../utils/ExpressError');
const path=require('path');
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const User= require('../Models/user.js');
const passport=require('passport');
const {middleware,redirecturl}=require("../middleware.js");
const UserController=require("../controller/user.js");
userrouter.get("/signup",wrapAsync(UserController.renderSignup));
userrouter.post("/signup",wrapAsync(UserController.Signup))
userrouter.get("/login",wrapAsync(UserController.RenderLogin))
userrouter.post("/login",redirecturl,passport.authenticate('local',{failureRedirect: '/user/login',
    failureFlash: true }),wrapAsync(UserController.Login));

userrouter.get("/logout",wrapAsync(UserController.LogOut))
module.exports=userrouter;
