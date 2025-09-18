// backend/models/OrderItem.js
import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema(
  {
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }, // Price at time of purchase
  },
  { timestamps: true }
);

export const OrderItem = mongoose.models.OrderItem || mongoose.model('OrderItem', OrderItemSchema);