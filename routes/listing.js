const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const {validateListing, isLoggedIn, isOwner} = require("../middleware.js");
const listingController = require("../controllers/listing.js");


router.route("/")
    .get(wrapAsync(listingController.index))   // index route
    .post(isLoggedIn, validateListing, wrapAsync(listingController.createListing));    // create route

// new route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
    .get(wrapAsync(listingController.showListing))  // show route
    .put(isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing))  // update route
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.createListing));   // delete route

// edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));


module.exports = router;