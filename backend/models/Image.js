import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  fileName: { type: String, required: true } // Only store S3 key
});

export default mongoose.model("Image", imageSchema);
