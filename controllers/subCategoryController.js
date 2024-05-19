const SubCategory = require("../models/subCategoryModel");
const Category = require("../models/categoryModel");

// Controller function to create a subcategory
const createSubcategory = async (req, res) => {
  try {
    const { categoryId, name, image, description, taxApplicability, tax } =
      req.body;
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    const subCategory = new SubCategory({
      category: categoryId,
      name,
      image,
      description,
      taxApplicability: taxApplicability ?? category.taxApplicability,
      tax: tax ?? category.tax,
    });

    await subCategory.save();
    category.subcategories.push(subCategory._id);
    await category.save();

    res
      .status(201)
      .json({ message: "SubCategory created successfully", subCategory });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getAllSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find().populate("items");
    res.status(200).json(subCategories);
  } catch (error) {
    console.error("Error fetching sub-categories:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

const getSubCategoriesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const subCategories = await SubCategory.find({
      category: categoryId,
    }).populate("items");

    if (!subCategories || subCategories.length === 0) {
      return res
        .status(404)
        .json({ message: "No sub-categories found for this category" });
    }

    res.status(200).json(subCategories);
  } catch (error) {
    console.error("Error fetching sub-categories:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

const getSubCategory = async (req, res) => {
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

const updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedSubCategory = await SubCategory.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedSubCategory) {
      return res.status(404).json({ message: "SubCategory not found" });
    }

    res.status(200).json({
      message: "SubCategory updated successfully",
      subCategory: updatedSubCategory,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createSubcategory,
  getAllSubCategories,
  getSubCategoriesByCategory,
  getSubCategory,
  updateSubCategory,
};
