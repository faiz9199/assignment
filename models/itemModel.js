const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  subCategory: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  name: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  taxApplicability: { type: Boolean, required: true },
  tax: { type: Number, default: 0 },
  baseAmount: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
});

itemSchema.pre("save", function (next) {
  this.totalAmount = this.baseAmount - this.discount;
  next();
});

module.exports = mongoose.model("Item", itemSchema);
