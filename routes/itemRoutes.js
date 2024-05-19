const express = require("express");
const {
  createItem,
  getAllItems,
  getItemsByCategory,
  getItemsBySubCategory,
  getItemByNameOrId,
  updateItem,
  searchItemByName,
} = require("../controllers/itemControllers");
const routes = express.Router();

routes.post("/item", createItem);
routes.get("/items", getAllItems);
routes.get("/items/category/:categoryId", getItemsByCategory);
routes.get("/items/subcategory/:subCategoryId", getItemsBySubCategory);
routes.get("/items/find", getItemByNameOrId);
routes.put("/items/:id", updateItem);
routes.get("/items/search", searchItemByName);

module.exports = routes;
