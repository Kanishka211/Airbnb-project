const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {listingschema}=require("../schema.js");
const {reviewschema}=require("../schema.js");
const ExpressError=require("../utils/ExpressError.js");
const Listing=require("../models/listing.js");
const {isLoggedIn}=require("../middleware.js");

const validatelisting=(req,res,next)=>{
    console.log("BODY:", req.body); 
    let {error}=listingschema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError (400,errMsg);
    }
    else{
        next();
    }
}

//INDEX ROUTE
router.get("/",wrapAsync(async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));
//new route
router.get("/new",isLoggedIn,(req,res)=>{
        res.render("listings/new.ejs"); 
});
//show route
router.get("/:id",wrapAsync(async(req,res)=>{
   
    let {id}=req.params;
     const listing=await Listing.findById(id).populate("reviews").populate("owner");
   
     if(!listing){
        req.flash("error","Oops,Listing you requested doesn't exist");
        res.redirect("/listings");
     }
      
    else{
        
        res.render("listings/show.ejs",{listing});
    }
    
}));
//create route
router.post("/",isLoggedIn,wrapAsync(async(req,res,next)=>{
        let result=listingschema.validate(req.body);
        
        console.log(result);
        if(result.error){
            throw new ExpressError(400,result.error);
        }
        let newlisting=new Listing(req.body.listing);
         newlisting.owner=req.user._id;
        await newlisting.save();
        console.log(req.body);
        req.flash("success","new listing created!");
        res.redirect("/listings");
   
    
}));
//edit route
router.get("/:id/edit",isLoggedIn,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
     
    res.render("listings/edit.ejs",{listing});

}));
//update route
router.put("/:id",isLoggedIn,wrapAsync(async(req,res,next)=>{
    if(!req.body.listing){
        next(new ExpressError(400,"Send valid data for listing"));
    }
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing updated!");
    res.redirect(`/listings/${id}`);
}));
//delete route
router.delete("/:id",isLoggedIn,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing deleted!");
    res.redirect('/listings');
}));

module.exports=router;