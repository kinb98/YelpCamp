const express = require("express");
const catchAsync = require("../utils/catchAsync");
const reviews = require("../controllers/reviews");
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");

//POST request to post reviews of camp sites.
router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

//route to delete the reviews of a camp site.
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

module.exports = router;
