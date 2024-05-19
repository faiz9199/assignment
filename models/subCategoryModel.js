const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  name: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  taxApplicability: { type: Boolean, default: false },
  tax: { type: Number, default: 0 },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }],
});

module.exports = mongoose.model("SubCategory", subCategorySchema);
