const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");


router.get("/signup", (req, res)=>{
    res.render("./users/signup.ejs");
});

router.post("/signup", wrapAsync(async(req, res, next)=>{
    let {username, email, password} = req.body;
    const newUser = new User({email, username});
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.flash("success", "Welcome to Wanderlust");
    res.redirect("/listings");
}));

router.get("/login", (req, res)=>{
    res.render("./users/login.ejs");
});

router.post("/login", 
    passport.authenticate('local', { 
        failureRedirect: '/users/login', 
        failureFlash: true,
    }), 
    async(req ,res)=>{
        req.flash("success", "welcome back to wanderlust!");
        res.redirect("/listings");
});

module.exports = router;