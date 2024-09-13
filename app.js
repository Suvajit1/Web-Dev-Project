const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

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


app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);


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