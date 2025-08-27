import mongoose from "mongoose";

const widgetSchema = new mongoose.Schema(
  {
    year: { type: Number, required: true },
    monthlySales: [
      {
        month: { type: String },
        units: { type: Number, default: 0 }
      }
    ],
    yearlyRevenue: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const Widget = mongoose.model("Widget", widgetSchema);
export default Widget;
