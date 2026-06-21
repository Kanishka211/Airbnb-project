const express=require("express");
const router=express.Router();

router.get("/",(req,res)=>{
    res.send("get for POSTS");
});
router.get("/:id",(req,res)=>{
    res.send("get for POST id");
});
router.delete("/:id",(req,res)=>{
    res.send("delete for POST id");
});
router.post("/",(req,res)=>{
    res.send("post for POSTS");
});

module.exports=router;