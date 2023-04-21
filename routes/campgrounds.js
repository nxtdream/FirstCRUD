const express = require("express");
const Joi = require("joi");
const routes = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const { isLoggedIn, isAuthor } = require("../middleware");
const campgrounds = require("../controllers/campgrounds");
const multer = require("multer");
const { storage } = require("../cloudinary/index");
const upload = multer({ storage });

const validateSchema = (req, res, next) => {
  const campgroundSchema = Joi.object({
    title: Joi.string().required(),
    price: Joi.number().min(1).required(),
    image: Joi.string(),
    location: Joi.string().required(),
    deleteImage: Joi.array(),
  });
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

routes
  .route("/")
  .get(catchAsync(campgrounds.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateSchema,
    catchAsync(campgrounds.createCampground)
  );

routes.get("/new", isLoggedIn, catchAsync(campgrounds.newForm));

routes
  .route("/:id")
  .get(catchAsync(campgrounds.showCampground))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateSchema,
    catchAsync(campgrounds.updateCampground)
  )
  .delete(catchAsync(campgrounds.deleteCampground));

routes.get("/:id/edit", isAuthor, catchAsync(campgrounds.editFormCampground));

module.exports = routes;
