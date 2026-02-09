const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlistController");

router.post("/add", wishlistController.addToWishlist);
router.get("/", wishlistController.getWishlist);
router.delete("/:id", wishlistController.removeFromWishlist);

module.exports = router;
