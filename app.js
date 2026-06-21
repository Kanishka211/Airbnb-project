const express=require("express");
const app=express();
let port=3000;
const path=require("path");
const methodOverride=require("method-override");
const ejsMate = require('ejs-mate');
const mongoose=require("mongoose");
const ExpressError=require("./utils/ExpressError.js");
//routes
const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");
const users=require("./routes/user.js");  

const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const MONGO_URL="mongodb://127.0.0.1:27017/dune-delight";
main()
.then(()=>{
    console.log("connected to db");
}).catch(err => console.log(err));
  
app.use(methodOverride('_method'))
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.use (express.static(path.join(__dirname,"public")));
async function main() {
  await mongoose.connect(MONGO_URL);

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
app.get("/",(req,res)=>{
    res.send("root is working");
});
const sessionoptions={
    
  secret: 'keyboard cat',
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+10*24*60*60*1000,
    maxAge:10*24*60*60*1000,
  }

}
app.use(session(sessionoptions));
app.use(flash());

//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})
// app.use("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"student@gmail.com",
//         username:"delta-student"
//     });
//     let registeredUser=await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// });

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
app.use("/",users);

app.use((req,res,next)=>{
    next(new ExpressError(404,"page not found"));
    
});

app.use((err,req,res,next)=>{
    let {statusCode=400,message="something went wrong"}=err;
    res.status(statusCode).render("error.ejs",{message});
    // res.send("something went wrong");
})
app.listen(port,()=>{
    console.log(`server is listening at port:${port}`);
});
