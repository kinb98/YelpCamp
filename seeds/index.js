const mongoose = require("mongoose");
const cities = require("./cities");
const Campground = require("../models/campground");
const { places, descriptors } = require("./seedHelpers");

mongoose
  .connect("mongodb://localhost:27017/yelp-camp")
  .then(() => {
    console.log("CONNECTION OPEN!!!");
  })
  .catch((err) => {
    console.log("OH NO ERROR!!!!");
    console.log(err);
  });

const randomPicker = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 300; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: "6178d96d0c300cc1b3a50aca",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${randomPicker(descriptors)} ${randomPicker(places)}`,
      description:
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quos totam nisi placeat consequatur? Obcaecati aspernatur ducimus, libero omnis maxime similique!",
      price,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      images: [
        {
          url: "https://res.cloudinary.com/du7hdhrce/image/upload/v1635858281/YelpCamp/pchk3guo7emno1pp77y3.jpg",
          filename: "YelpCamp/pchk3guo7emno1pp77y3",
        },
      ],
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
