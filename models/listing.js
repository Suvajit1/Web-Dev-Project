const mongoose = require("mongoose");
const Review = require("./review");
const User = require("./user");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title : {
        type : String,
        required : true,
    },

    description : {
        type : String,
    },

    image : {
        type : String,
        default : "https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?q=80&w=1335&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set : (v)=>{
            return v === "" ? "https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?q=80&w=1335&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v;
        },
    },

    price : {
        type : Number,
        required : true,
        min : [1, "price is to low for listing"],
    },

    location : {
        type : String,
        required : true,
    },

    country : {
        type : String,
        required : true,
    },

    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review",
        }
    ],

    owner : {
        type : Schema.Types.ObjectId,
        ref : "User",
    }
});

// post mongoose middleware
listingSchema.post("findOneAndDelete", async (listing)=>{
    if(listing && listing.reviews.length){
        await Review.deleteMany({_id : {$in :listing.reviews}});
    }
    // console.log("post middleware");
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;