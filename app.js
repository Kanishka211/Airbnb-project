if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
console.log("Google ID loaded:", !!process.env.GOOGLE_CLIENT_ID);
console.log("Google secret loaded:", !!process.env.GOOGLE_CLIENT_SECRET);
console.log("Google callback:", process.env.GOOGLE_CALLBACK_URL);
const dbUrl = process.env.ATLAS_DB_URL || "mongodb://127.0.0.1:27017/wanderlust";


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodoverride = require("method-override");
const path = require("path");
const ExpressError = require("./utils/ExpressError.js");
const ejsMate = require("ejs-mate");
const listings = require("./models/listing.js");

const ListingRouter = require("./routes/listing.js");
const categoryRouter=require("./routes/category.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const searchRouter = require("./routes/search.js");

const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("./models/user.js");

app.use(methodoverride("_method"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");



app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

const sessionOption = {
  secret: process.env.SECRET || "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
if(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET){
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = new User({
            googleId: profile.id,
            email: profile.emails[0].value,
            username:
              profile.displayName || profile.emails[0].value.split("@")[0],
          });
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);
}

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.get("/", (req, res) => {
  res.redirect("/listings");
});
app.use("/listings", ListingRouter);
app.use("/listings/:id", reviewRouter);
app.use("/", userRouter);
app.use("/",categoryRouter);
app.use("/search",searchRouter);


main()
  .then(() => {
    console.log("Successfully connected");
  })
  .catch((err) => console.log(err));


async function main() {
  await mongoose.connect(dbUrl);
}



app.use((req, res, next) => {
  next(new ExpressError(404, "Page not Found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
});




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));