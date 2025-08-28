import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["1", "2"],
    },
    description: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
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
    },
    unitQuantity: { type: Number, default: 0 },

    is_deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Item = mongoose.model("Item", itemSchema);

export default Item;
