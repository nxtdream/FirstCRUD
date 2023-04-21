const { model } = require("mongoose");
const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};
module.exports.newForm = async (req, res) => {
  res.render("campgrounds/new");
};
module.exports.createCampground = async (req, res) => {
  // if (!req.body.campground)
  //   throw new ExpressError("Invalid Data Campground", 404);
  const campground = new Campground(req.body);
  campground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campground.author = req.user._id;
  await campground.save();
  req.flash("success", "You are make a new post");
  res.redirect(`/campgrounds/${campground._id}`);
};
module.exports.showCampground = async (req, res, next) => {
  // const {id} =req.params;
  const campground = await Campground.findById(req.params.id)
    .populate("reviews")
    .populate("author");
  if (!campground) {
    req.flash("error", "Sorry Something Wrong!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
};
module.exports.editFormCampground = async (req, res) => {
  const campground = await Campground.findById(req.params["id"]);
  if (!campground) {
    req.flash("error", "Sorry Something Wrong!");
    return res.redirect("/campgrounds");
  }
  // console.log(req.user);
  res.render("campgrounds/edit", { campground });
};
module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body });
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campground.images.push(...imgs);
  await campground.save();
  if (req.body.deleteImage) {
    for (let fileName of req.body.deleteImage) {
      await cloudinary.uploader.destroy(fileName);
    }
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImage } } },
    });
  }
  res.redirect(`/campgrounds/${campground.id}`);
};
module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Your campground deleted");
  res.redirect("/campgrounds");
};
