const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing.js");
const {validateListing, isLoggedIn, isOwner} = require("../middleware.js");


// index route
router.get("/", wrapAsync(async (req, res, next)=>{
    const allListings = await Listing.find();
    res.render("./listings/index.ejs", {allListings});
}));


// creat 
// new route
router.get("/new", isLoggedIn, (req,res)=>{
    // console.log(req.user);
    res.render("./listings/new.ejs");
});

// creat route
router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res, next)=>{
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}));

// show route
router.get("/:id", wrapAsync(async (req, res, next)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for doesn't exist!");
        res.redirect("/listings");
    }
    // console.log(listing);
    res.render("./listings/show.ejs", {listing});
}));


// Edit and update route
// edit
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res, next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for doesn't exist!");
        res.redirect("/listings");
    }
    res.render("./listings/edit", {listing});
}));

// update
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(async (req, res, next)=>{
    let {id} = req.params;
    let newListing = req.body.listing;
    await Listing.findByIdAndUpdate(id, newListing);
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}));

// delete route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res, next)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}));

module.exports = router;