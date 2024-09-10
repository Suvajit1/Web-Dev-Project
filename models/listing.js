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

    image : {
        type : String,
        default : "https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?q=80&w=1335&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set : (v)=>{
            return v === "" ? "https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?q=80&w=1335&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v;
        },
    },

    // image: {
    //     filename: { 
    //         type: String, 
    //         // required: true ,
    //     },
    //     url: { 
    //         type: String, 
    //         // required: true 
    //         default : "https://unsplash.com/photos/birds-eye-view-of-islands-guNIjIuUcgY",
    //         set : (v)=>{
    //             return v === "" ? "https://unsplash.com/photos/birds-eye-view-of-islands-guNIjIuUcgY" : v;
    //         },
    //     }
    // },

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
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;