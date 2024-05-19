const Category = require("../models/categoryModel");

// Create a new category
const createCategory = async (req, res) => {
  try {
    const { name, image, description, taxApplicability, tax, taxType } =
      req.body;
    const category = new Category({
      name,
      image,
      description,
      taxApplicability,
      tax,
      taxType,
    });
    await category.save();
    res
      .status(201)
      .json({ message: "Category created successfully", category });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate("subcategories");
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

const getCategory = async (req, res) => {
  try {
    const { id, name } = req.query;
    let category;

    if (id) {
      category = await Category.findById(id).populate("subcategories");
    } else if (name) {
      category = await Category.findOne({ name }).populate("subcategories");
    } else {
      return res
        .status(400)
        .json({ message: "Either id or name must be provided" });
    }

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res
      .status(200)
      .json({
        message: "Category updated successfully",
        category: updatedCategory,
      });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategory,
  updateCategory,
};
