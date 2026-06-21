const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");
const { listingschema } = require("../schema");

const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },

    description:String,
    image: {
        filename: {
            type: String,
            default: "listingimage"
        },
        url: {
            type: String,
            default: "https://news.airbnb.com/wp-content/uploads/sites/4/2019/06/PJM020719Q202_Luxe_WanakaNZ_LivingRoom_0264-LightOn_R1.jpg?resize=2400,1260",
            set: (v) =>
                v === ""
                    ? "https://news.airbnb.com/wp-content/uploads/sites/4/2019/06/PJM020719Q202_Luxe_WanakaNZ_LivingRoom_0264-LightOn_R1.jpg?resize=2400,1260"
                    : v
        }
    },
    price:{
        type:Number,
        required:true},
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        }
    ],
    owner:
        {
            type:Schema.Types.ObjectId,
            ref:"User"
        }
    

});
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        (await Review.deleteMany({_id:{$in:listing.reviews}}))
    }
});
const Listing=mongoose.model("Listing",listingSchema);
module.exports =Listing;