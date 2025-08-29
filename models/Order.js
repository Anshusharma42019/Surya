// models/order.model.js
import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    itemName: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitType: {
      type: String,
      enum: [
        // Medicine Units
        
        "Tablet",
        "Capsule",
        "Milligram",
        "Microgram",
        "Milliliter",
        "Cubic Centimeter",
        "Drop",
        "Gram",
        "Ounce",
        "Bottle",
        "Vial",
        "Blister Pack",
        "Strip",
        "Box",
        "Syringe",
        "Tube",

        // Optical Units
        "Diopter (D)",
        "Prism Diopter (Δ)",
        "Millimeter (mm)",
        "Base Curve (BC)",
        "Diameter (DIA)",
        "Cylinder (CYL)",
        "Axis (AX)",
        "Pair",
      ],
      required: true
    },

    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
  },
  { _id: true }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    invoiceNumber: { type: String, unique: true, sparse: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    items: [orderItemSchema],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    is_deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
