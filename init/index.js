const User = require("../models/user.js");
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]); // must stay first

require("dotenv").config();
const mongoose = require("mongoose");
const listing = require("../models/listing.js");
const initData = require("./data.js");

const initDB = async () => {
  const user = await User.findOne();
  if (!user) {
    console.log("No users in this database. Sign up in the app first.");
    return;
  }

  await listing.deleteMany({});

  const categories = ["Trending", "Bed&Breakfast", "Farm", "OMG!", "Arctic", "Lake", "Beach"];

  const data = initData.data.map((obj, i) => ({
    ...obj,
    category: categories[i % categories.length],
    owner: user._id,
    geometry: { type: "Point", coordinates: [77.209, 28.6139] },
  }));

  await listing.insertMany(data);

  console.log("DB:", mongoose.connection.host, mongoose.connection.name);
  console.log("owner set to:", user._id.toString());
  console.log("count:", await listing.countDocuments());
  console.log("data was initialised");
};

  

mongoose
  .connect(process.env.ATLAS_DB_URL) // see note 1
  .then(() => {
    console.log("Successfully connected");
    return initDB();
  })
  .then(() => mongoose.connection.close())
  .catch((err) => {
    console.log(err);
    mongoose.connection.close();
  });