const express = require("express");
require("dotenv").config();

const port = process.env.PORT || 5000;
require("./config/db");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello");
});

const categoryRoutes = require("./routes/categoryRoutes");
const subCategoryRoutes = require("./routes/subCategoryRoutes");
const itemRoutes = require("./routes/itemRoutes");

app.use("/api", categoryRoutes);
app.use("/api", subCategoryRoutes);
app.use("/api", itemRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
