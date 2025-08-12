import express from "express";
import multer from "multer";
import AWS from "aws-sdk";
import fs from "fs";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Image from "./models/Image.js";

dotenv.config();
const app = express();
const upload = multer({ dest: "uploads/" });

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Error:", err));

// AWS S3 config
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION
});
const s3 = new AWS.S3();

// Upload and save filename in MongoDB
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const fileContent = fs.readFileSync(req.file.path);
    const fileName = `uploads/${Date.now()}-${req.file.originalname}`;

    const params = {
      Bucket: process.env.AWS_BUCKET,
      Key: fileName,
      Body: fileContent,
      ContentType: req.file.mimetype,
      ACL: "private"
    };

    // Upload to S3
    const data = await s3.upload(params).promise();

    // Save filename in MongoDB
    const newImage = new Image({ fileName });
    await newImage.save();

    // Delete temp file
    fs.unlinkSync(req.file.path);

    res.json({ message: "File uploaded", id: newImage._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

// Get signed URL by MongoDB ID
app.get("/image/:id", async (req, res) => {
  try {
    const img = await Image.findById(req.params.id);
    if (!img) return res.status(404).json({ error: "Image not found" });

    const signedUrl = s3.getSignedUrl("getObject", {
      Bucket: process.env.AWS_BUCKET,
      Key: img.fileName,
      Expires: 60 // URL valid for 60 seconds
    });

    res.json({ url: signedUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching image" });
  }
});

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
