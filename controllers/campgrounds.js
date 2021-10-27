const Campground = require("../models/campground");

//Showing all the available campgrounds
module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

//Renders the form to create a new campground
module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

//Creates a new campground and redirects to the home page
module.exports.createCampground = async (req, res, next) => {
  // if (!req.body.campground)
  //   throw new ExpressError("Invalid Campground data", 400)
  const campground = new Campground(req.body.campground);
  campground.author = req.user._id;
  await campground.save();
  req.flash("success", "Successfully created a new campground");
  res.redirect(`/campgrounds/${campground._id}`);
};

//Shows the details of a specific campground
module.exports.showCampgrounds = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!campground) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
};

//Route to the edit form of a particular campsite
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(req.params.id);
  if (!campground) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground });
};

//PUT request to edit the details of a camp
module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;

  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  req.flash("success", "Successfully updated campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};

//DELETE request to delete the details of a camp
module.exports.deleteCampground = async (req, res) => {
  await Campground.findByIdAndDelete(req.params.id);
  req.flash("success", "Successfully deleted campground");
  res.redirect("/campgrounds");
};
