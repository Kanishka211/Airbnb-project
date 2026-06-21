const express=require("express");
const app=express();
const cookieParser=require("cookie-parser");
const session=require("express-session");
const flash=require("connect-flash");
const path=require("path");
app.use(flash());
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
const sessioninfo={
    
  secret: 'keyboard cat',
  resave:false,
  saveUninitialized:true,

}
app.use(session(sessioninfo));
app.use(cookieParser("secretcode"));
 
app.get("/register",(req,res)=>{
    let {name="user"}=req.query;
    req.session.name=name;
    if(name==="user"){
        req.flash("error","user not registered yet!");
    }
    else{
        req.flash("success","user registered successfully");
    }
    res.redirect("/hello");
})
app.get("/hello",(req,res)=>{
    res.render("page.ejs",{name:req.session.name ,successmsg:req.flash("success"),errormsg:req.flash("error")});
})
// const router=require("router");
let port=8080;
const users=require("./route/user.js");
const posts=require("./route/post.js");
app.get("/",(req,res)=>{
    res.send("root is working");
});

app.get("/reqcount",(req,res)=>{
    if(req.session.count){
        req.session.count++;

    }
    else{
        req.session.count=1;
    }
    res.send(`you sent request ${req.session.count} times`);
})
app.get("/test",(req,res)=>{
    res.send("test successful!");
})
// app.get("/getcookie",(req,res)=>{
//     res.cookie("greet","hello");
//     res.cookie("MadeIn","India");
//     res.send("done");
// })
// app.get("/getsignedcookie",(req,res)=>{
//     res.cookie("color","red",{signed:true});
//     res.send("done!")
// });
// app.get("/verify",(req,res)=>{
//     res.send(req.signedCookies);
// })
// app.get("/greet",(req,res)=>{
//     let {name="anonymous"}=req.cookies;
//     res.send(`Hi ${name}`);
// })

app.use("/users",users);
app.use("/posts",posts);
app.listen(port,()=>{
    console.log(`server is listening at port:${port}`);
});
