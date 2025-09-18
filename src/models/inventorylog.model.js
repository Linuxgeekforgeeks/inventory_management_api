// backend/models/InventoryLog.js
import mongoose from 'mongoose';

const InventoryLogSchema = new mongoose.Schema(
  {
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    change_type: { type: String, required: true, enum: ['add', 'remove', 'adjust'] },
    quantity: { type: Number, required: true },
    reason: { type: String },
  },
  { timestamps: true }
);

export const InventoryLog = mongoose.models.InventoryLog || mongoose.model('InventoryLog', InventoryLogSchema);