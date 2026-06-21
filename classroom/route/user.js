const express=require("express");
const router=express.Router();

router.get("/",(req,res)=>{
    res.send("get for users");
});
router.get("/:id",(req,res)=>{
    res.send("get for user id");
});
router.delete("/:id",(req,res)=>{
    res.send("delete for user id");
});
router.post("/",(req,res)=>{
    res.send("post for users");
});

module.exports=router;