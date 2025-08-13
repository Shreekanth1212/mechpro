import mongoose from "mongoose";

const imagePairSchema = new mongoose.Schema(
    {
        image: { type: String, required: true },
        reviewImage: { type: String, default: null },
    }
);

const subfieldSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    images: {
      type: [imagePairSchema],
      default: [],
    },
  },
);

const fieldSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    subfields: {
      type: [subfieldSchema],
      default: [],
    },
  },
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    fields: {
      type: [fieldSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
