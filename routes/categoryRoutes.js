const express = require("express");
const {
  createCategory,
  getAllCategories,
  updateCategory,
  getCategory,
} = require("../controllers/categoryController");
const routes = express.Router();

routes.post("/categories", createCategory);
routes.get("/categories", getAllCategories);
routes.get("/categories/find", getCategory);
routes.put("/categories/:id", updateCategory);

module.exports = routes;
