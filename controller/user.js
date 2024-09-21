const express=require('express');

const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const User= require('../Models/user.js');


module.exports.renderSignup=(req,res)=>{
    res.render("users/signup.ejs")
    }


    module.exports.Signup=async(req,res)=>{
        try{ const {email,username,password}=req.body;
        const new_user=new User({email,username});
        const val=await User.register(new_user,password);
        req.login(val,(err)=>{
            if(err){
                res.send("something went wrong")
            }else{
                req.flash("success","welcome to wanderlust")
                res.redirect('/listings')
            }
        })
        }
        catch(err){
            req.flash("error",err.message)
            res.redirect("/user/signup")
        }
               
            
           
        }

        module.exports.RenderLogin=(req,res)=>{
            res.render("users/login.ejs")
        }


        module.exports.Login=(req,res)=>{
            req.flash("success","welcome back to wanderlust")
            console.log('url='+res.locals.url)
            var url=res.locals.url;
            if(!url){
                url="/listings";
            }
    
       res.redirect(url);
    }

    module.exports.LogOut=(req,res,next)=>{
        req.logOut((err)=>{
            if(err){
                res.send("something went wrong")
            }else{
                req.flash("success","user logged out")
                res.redirect('/user/login')
            }
        })
        
        }