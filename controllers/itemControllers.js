const Item = require("../models/itemModel");
const Category = require("../models/categoryModel");
const SubCategory = require("../models/subCategoryModel");

// Controller function to create an item
const createItem = async (req, res) => {
  try {
    const {
      subCategoryId,
      categoryId,
      name,
      image,
      description,
      taxApplicability,
      tax,
      baseAmount,
      discount,
    } = req.body;

    let category, subCategory;
    if (subCategoryId) {
      subCategory = await SubCategory.findById(subCategoryId);
      if (!subCategory) {
        return res.status(404).json({ message: "SubCategory not found" });
      }
    } else if (categoryId) {
      category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
    } else {
      return res
        .status(400)
        .json({ message: "Category or SubCategory is required" });
    }

    const item = new Item({
      subCategory: subCategoryId,
      category: categoryId,
      name,
      image,
      description,
      taxApplicability,
      tax,
      baseAmount,
      discount,
      totalAmount: baseAmount - discount,
    });

    await item.save();
    if (subCategory) {
      subCategory.items.push(item._id);
      await subCategory.save();
    }

    res.status(201).json({ message: "Item created successfully", item });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getAllItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

const getItemsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Find all subcategories under the given category
    const subCategories = await SubCategory.find({ category: categoryId });

    // Extract subcategory IDs
    const subCategoryIds = subCategories.map((subCategory) => subCategory._id);

    // Find all items that belong to any of the subcategories
    const items = await Item.find({ subCategory: { $in: subCategoryIds } });

    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

const getItemsBySubCategory = async (req, res) => {
  try {
    const { subCategoryId } = req.params;

    // Find all items that belong to the sub-category
    const items = await Item.find({ subCategory: subCategoryId });

    if (!items || items.length === 0) {
      return res
        .status(404)
        .json({ message: "No items found for this sub-category" });
    }

    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

const getItemByNameOrId = async (req, res) => {
  try {
    const { id, name } = req.query;
    let subCategory;

    if (id) {
      subCategory = await SubCategory.findById(id).populate("items");
    } else if (name) {
      subCategory = await SubCategory.findOne({ name }).populate("items");
    } else {
      return res
        .status(400)
        .json({ message: "Either id or name must be provided" });
    }

    if (!subCategory) {
      return res.status(404).json({ message: "Sub-category not found" });
    }

    res.status(200).json(subCategory);
  } catch (error) {
    console.error("Error fetching sub-category:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Calculate the total amount if baseAmount or discount are updated
    if (updateData.baseAmount || updateData.discount) {
      updateData.totalAmount =
        (updateData.baseAmount || 0) - (updateData.discount || 0);
    }

    const updatedItem = await Item.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res
      .status(200)
      .json({ message: "Item updated successfully", item: updatedItem });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const searchItemByName = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res
        .status(400)
        .json({ message: "Name query parameter is required" });
    }

    const items = await Item.find({ name: new RegExp(name, "i") });

    if (items.length === 0) {
      return res
        .status(404)
        .json({ message: "No items found with the given name" });
    }

    res.status(200).json({ message: "Items found", items });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
module.exports = {
  createItem,
  getAllItems,
  getItemsByCategory,
  getItemsBySubCategory,
  getItemByNameOrId,
  updateItem,
  searchItemByName,
};
