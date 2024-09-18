const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

// pass as middleware function to validate listingSchema(Joi)
module.exports.validateListing = (req, res, next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

// pass as middleware function to validate reviewSchema(Joi)
module.exports.validateReview = (req, res, next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

module.exports.isLoggedIn = (req, res, next)=>{
    // console.log(req.path, "..", req.originalUrl)
    if(!req.isAuthenticated()){
        // redirect url after signup
        req.session.redirectUrl = req.originalUrl;
        // req.flash("error", "You must be logged in to create a listing!");
        req.flash("error", "You must be logged in!");
        return res.redirect("/users/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "you are not the owner of the listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}