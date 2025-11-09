import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  image: String,
  description: String
}, { timestamps: true });

export default mongoose.model("Product", productSchema);