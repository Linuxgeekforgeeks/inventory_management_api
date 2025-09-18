// backend/models/product.model.js
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    brand_id: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" }, // 🔥 New field
    buy_price: { type: Number, required: true },
    image: {
      type: [String],
      required: [true, "Image is Required."],
    },
    sell_price: { type: Number, required: true },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    stock_quantity: { type: Number, required: true },
  },
  { timestamps: true }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);
export default Product;
