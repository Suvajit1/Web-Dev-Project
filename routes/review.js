const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {validateReview} = require("../middleware.js");


// Reviews
// post review route
router.post("/", validateReview, wrapAsync(async (req, res, next)=>{
    let {id} = req.params;
    let newReview = new Review(req.body.review);
    let listing = await Listing.findById(id);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    // console.log("new review saved");
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
}));


// delete review route
router.delete("/:reviewId", wrapAsync(async (req, res, next)=>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id , {$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;
