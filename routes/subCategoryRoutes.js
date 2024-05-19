const express = require("express");
const {
  createSubcategory,
  getAllSubCategories,
  getSubCategoriesByCategory,
  getSubCategory,
  updateSubCategory,
} = require("../controllers/subCategoryController");
const routes = express.Router();

routes.post("/subcategories", createSubcategory);
routes.get("/subcategories", getAllSubCategories);
routes.get("/subcategories/category/:categoryId", getSubCategoriesByCategory);
routes.get("/subcategories/find", getSubCategory);
routes.put("/subcategories/:id", updateSubCategory);
module.exports = routes;
