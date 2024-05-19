const mongoose = require("mongoose");

const URL = process.env.MONGO_URL;

mongoose
  .connect(URL)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.log(error);
  });
