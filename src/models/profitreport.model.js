// backend/models/ProfitReport.js
import mongoose from 'mongoose';

const ProfitReportSchema = new mongoose.Schema(
  {
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    revenue: { type: Number, required: true },
    cost: { type: Number, required: true },
    profit: { type: Number, required: true },
  },
  { timestamps: true }
);

export const ProfitReport = mongoose.models.ProfitReport || mongoose.model('ProfitReport', ProfitReportSchema);