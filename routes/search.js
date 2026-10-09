const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing");

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const searchListings = wrapAsync(async (req, res) => {
  const term = (req.body.search || req.query.search || "").trim();

  if (!term) {
    return res.redirect("/listings");
  }

  const regex = new RegExp(escapeRegex(term), "i");

  const results = await Listing.find({
    $or: [
      { title: regex },
      { location: regex },
      { country: regex },
      { category: regex },
    ],
  });

  res.render("listings/search.ejs", { results, term });
});

router.post("/", searchListings);
router.get("/", searchListings);

module.exports = router;