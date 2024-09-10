const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const Listing = require("./models/listing.js");
const ejsmate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");


app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


app.engine('ejs', ejsmate);

main()
.then((result)=>{
    console.log(`Connected to DB Successfully!`);
})
.catch((err)=>{
    console.log("some err in DB");
});

async function main() {
    mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}


app.get("/", (req, res)=>{
    res.send("hi I'm root!");
});

// app.get("/testListing", async (req,res)=>{
//     let sampleListing = new Listing({
//         title : "My New Villa",
//         description : "By the beach",
//         price : 1200,
//         location : "Calangute, Goa",
//         country : "India",
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });


// pass as middleware function for validate listingSchema
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
app.get("/listings", wrapAsync(async (req, res, next)=>{
    const allListings = await Listing.find();
    res.render("./listings/index.ejs", {allListings});
}));


// creat 
// new route
app.get("/listings/new", (req,res)=>{
    res.render("./listings/new.ejs");
});

// // creat route
// app.post("/listings", wrapAsync(async (req, res, next)=>{
//     if(!req.body.listing){
//         return next(new ExpressError(400, "Send valid data for listing"));
//     }
//     // let listing = req.body;
//     // console.log(req.body);
//     // console.log(req.body.listing);
//     const newListing = new Listing(req.body.listing);
//     await newListing.save();
//     res.redirect("/listings");
// }));

// // creat route
// app.post("/listings", wrapAsync(async (req, res, next)=>{
//     const result = listingSchema.validate(req.body);
//     console.log(result);
//     if(result.error){
//         return next(new ExpressError(400, result.error));
//     }
//     const newListing = new Listing(req.body.listing);
//     await newListing.save();
//     res.redirect("/listings");
// }));

// creat route
app.post("/listings", validateListing, wrapAsync(async (req, res, next)=>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

// show route
app.get("/listings/:id", wrapAsync(async (req, res, next)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/show.ejs", {listing});
}));


// Edit and update route
// edit
app.get("/listings/:id/edit", wrapAsync(async (req, res, next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("./listings/edit", {listing});
}));

// update
app.put("/listings/:id", validateListing, wrapAsync(async (req, res, next)=>{
    // if(!req.body.listing){
    //     return next(new ExpressError(400, "Send valid data for listing"));
    // }
    let {id} = req.params;
    let newListing = req.body.listing;
    await Listing.findByIdAndUpdate(id, newListing);
    res.redirect(`/listings/${id}`);
}));

// delete route
app.delete("/listings/:id", wrapAsync(async (req, res, next)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

app.all("*", (req, res, next)=>{
    next(new ExpressError(404, "Page Not Found"));
})

app.use((err, req, res, next)=>{
    // res.send("Something went wrong");
    let {statusCode = 500, message = "Something went wrong"} = err;
    res.status(statusCode).render("./listings/error.ejs", {message});
});

app.listen(port, ()=>{
    console.log(`app is listening on port : ${port}`);
});