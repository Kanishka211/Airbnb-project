const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
require("dotenv").config();
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

async function run() {
  await mongoose.connect(process.env.ATLAS_DB_URL, { dbName: "wanderlust" });
  console.log("DB:", mongoose.connection.name);

  const user = await User.findOne({ username: "kanishkasharma" });
  if (!user) {
    console.log("User not found. Users in this DB:");
    console.log((await User.find()).map((u) => u.username));
    return;
  }

  const result = await Listing.updateMany({}, { $set: { owner: user._id } });
  console.log("Owner set to:", user._id.toString());
  console.log("Listings updated:", result.modifiedCount);
}

run()
  .catch((err) => console.log(err))
  .finally(() => mongoose.connection.close());