const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20 + 10);
    const camp = new Campground({
      author: "63d91f07c8c0a4f89593e394",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      images: [
        {
          url: "https://res.cloudinary.com/daqwxt9n9/image/upload/v1681222377/yelpcamp/dqzqnrjp1wnfh90n9oin.jpg",
          filename: "yelpcamp/dqzqnrjp1wnfh90n9oin",
        },
        {
          url: "https://res.cloudinary.com/daqwxt9n9/image/upload/v1681222417/yelpcamp/khgk0ypsb5ephgr6r9ug.jpg",
          filename: "yelpcamp/khgk0ypsb5ephgr6r9ug",
        },
      ],
      price,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
