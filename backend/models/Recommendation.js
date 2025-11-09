import mongoose from "mongoose";

const recommendationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    query: { type: String, required: true },
    resultSummary: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Recommendation", recommendationSchema);
