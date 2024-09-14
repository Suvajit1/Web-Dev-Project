const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { listingSchema } = require("../schema.js");

// pass as middleware function to validate listingSchema(Joi)
const validateListing = (req, res, next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

// index route
router.get("/", wrapAsync(async (req, res, next)=>{
    const allListings = await Listing.find();
    res.render("./listings/index.ejs", {allListings});
}));


// creat 
// new route
router.get("/new", (req,res)=>{
    res.render("./listings/new.ejs");
});

// creat route
router.post("/", validateListing, wrapAsync(async (req, res, next)=>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}));

// show route
router.get("/:id", wrapAsync(async (req, res, next)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error", "Listing you requested for doesn't exist!");
        res.redirect("/listings");
    }
    res.render("./listings/show.ejs", {listing});
}));


// Edit and update route
// edit
router.get("/:id/edit", wrapAsync(async (req, res, next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for doesn't exist!");
        res.redirect("/listings");
    }
    res.render("./listings/edit", {listing});
}));

// update
router.put("/:id", validateListing, wrapAsync(async (req, res, next)=>{
    let {id} = req.params;
    let newListing = req.body.listing;
    await Listing.findByIdAndUpdate(id, newListing);
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}));

// delete route
router.delete("/:id", wrapAsync(async (req, res, next)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}));

module.exports = router;