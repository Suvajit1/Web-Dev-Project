const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title : {
        type : String,
        required : true,
    },

    description : {
        type : String,
    },

    // image : {
    //     type : String,
    //     default : "https://unsplash.com/photos/birds-eye-view-of-islands-guNIjIuUcgY",
    //     set : (v)=>{
    //         return v === "" ? "https://unsplash.com/photos/birds-eye-view-of-islands-guNIjIuUcgY" : v;
    //     },
    // },

    image: {
        filename: { 
            type: String, 
            // required: true ,
        },
        url: { 
            type: String, 
            // required: true 
            default : "https://unsplash.com/photos/birds-eye-view-of-islands-guNIjIuUcgY",
            set : (v)=>{
                return v === "" ? "https://unsplash.com/photos/birds-eye-view-of-islands-guNIjIuUcgY" : v;
            },
        }
    },

    price : {
        type : Number,
    },

    location : {
        type : String,
    },

    country : {
        type : String,
    },
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;