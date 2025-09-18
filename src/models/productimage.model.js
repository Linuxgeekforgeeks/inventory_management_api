// backend/models/ProductImage.js
import mongoose from 'mongoose';

const ProductImageSchema = new mongoose.Schema(
  {
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    image_url: { type: String, required: true },
  },
  { timestamps: true }
);

export const ProductImage = mongoose.models.ProductImage || mongoose.model('ProductImage', ProductImageSchema);