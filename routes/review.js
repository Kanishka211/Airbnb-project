const express=require("express");
const router=express.Router({mergeParams: true });
const wrapAsync=require("../utils/wrapAsync.js");
const {listingschema}=require("../schema.js");
const {reviewschema}=require("../schema.js");
const Review=require("../models/review.js");
const ExpressError=require("../utils/ExpressError.js");
const Listing=require("../models/listing.js");
const validatereview=(req,res,next)=>{
    console.log("BODY:", req.body); 
    let { error } = reviewschema.validate(req.body, { abortEarly: false, convert: true });
    
      console.log(error?.details);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError (400,errMsg);
        
    }
    else{
        next();
    }
}
//reviews
//post route
router.post("/",validatereview,wrapAsync(async(req,res)=>{
      
       let listing= await Listing.findById(req.params.id);
       let newReview=new Review(req.body.review);
       listing.reviews.push(newReview);
       await newReview.save();
       await listing.save();
       console.log("new review saved");
       req.flash("success","New review added!");
      res.redirect(`/listings/${listing._id}`);
    
    // console.log("ROUTE HIT");
    // res.send("working");

}));
//delete review route 
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
     let {id,reviewId}=req.params;
     await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
     await Review.findByIdAndDelete(reviewId);
     req.flash("success","Review deleted!");
     res.redirect(`/listings/${id}`);
}))

module.exports=router;
