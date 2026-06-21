const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport=require("passport");
const LocalStrategy=require("passport-local");

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});
router.post("/signup",wrapAsync(async(req,res)=>{
    try{
        let {username,email,password}=req.body;
    const newUser=new User({email,username});
    const registeredUser=await User.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);

        }
        req.flash("success","Welcome to Dune-Delight");
        res.redirect("/listings");
    })    
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}));
 //login
 router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
 })
 router.post("/login",passport.authenticate('local', { failureRedirect: '/login', failureMessage: true }),wrapAsync(async(req,res)=>{
     req.flash("success","Welcome back to Dune-Delight");
     res.redirect("/listings");
 }));
 //logout
 router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        else{
            req.flash("success","You are logged out now!");
            res.redirect("/listings");
        }
    })
 })

module.exports=router;