const express = require("express");
const routes = express.Router({ mergeParams: true });
const Joi = require("joi");
const Campground = require("../models/campground");
const Review = require("../models/reviews");
const catchAsync = require("../utils/catchAsync");
const { merge } = require("./campgrounds");
const { isLoggedIn, isReviewId } = require("../middleware");
const reviews = require("../controllers/reviews");

const validateReview = (req, res, next) => {
  const reviewsSchema = Joi.object({
    review: Joi.object({
      rating: Joi.number().required(),
      body: Joi.string().required(),
    }).required(),
  });
  const { error } = reviewsSchema.validate(req.body);
  if (error) {
    console.log(error);
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

routes.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

routes.delete("/:reviewID", isReviewId, catchAsync(reviews.deleteReview));

module.exports = routes;
