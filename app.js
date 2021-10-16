const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const Campground = require("./models/campground");

mongoose
  .connect("mongodb://localhost:27017/yelp-camp")
  .then(() => {
    console.log("CONNECTION OPEN!!!");
  })
  .catch((err) => {
    console.log("OH NO ERROR!!!!");
    console.log(err);
  });

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

//Home route
app.get("/", (req, res) => {
  res.render("home");
});

//Showing all the available campgrounds
app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});

//Renders the form to create a new campground
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

//Creates a new campground and redirects to the home page
app.post("/campgrounds", async (req, res) => {
  const campground = new Campground(req.body.campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
});

//Shows the details of a specific campground
app.get("/campgrounds/:id", async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/show", { campground });
});

//Route to the edit form of a particular campsite
app.get("/campgrounds/:id/edit", async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/edit", { campground });
});

//PUT request to edit the details of a camp
app.put("/campgrounds/:id", async (req, res) => {
  const campground = await Campground.findByIdAndUpdate(req.params.id, {
    ...req.body.campground,
  });
  res.redirect(`/campgrounds/${campground._id}`);
});

//DELETE request to delete the details of a camp
app.delete("/campgrounds/:id/", async (req, res) => {
  await Campground.findByIdAndDelete(req.params.id);
  res.redirect("/campgrounds");
});

app.listen(3000, () => {
  console.log("Listening at port 3000");
});
