import multer from "multer";
import s3 from "../config/s3.js";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const uploadSingleImage = [
  upload.single("image"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const fileName = `public/${Date.now()}-${req.file.originalname}`;
      const params = {
        Bucket: process.env.AWS_BUCKET,
        Key: fileName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      await s3.send(new PutObjectCommand(params));
      req.uploadedFileName = `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
      next();
    } catch (err) {
      console.error("Image upload error:", err);
      res.status(500).json({ error: "Image upload failed" });
    }
  },
];

export const uploadMultipleImages = [
  upload.array("images", 10),
  async (req, res, next) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      const uploadResults = await Promise.all(
        req.files.map(async (file) => {
          const fileName = `public/${Date.now()}-${file.originalname}`;
          const params = {
            Bucket: process.env.AWS_BUCKET,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
          };
          await s3.send(new PutObjectCommand(params));
          return `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
        })
      );

      req.uploadedFileNames = uploadResults;
      next();
    } catch (err) {
      console.error("Multiple image upload error:", err);
      res.status(500).json({ error: "Image upload failed" });
    }
  },
];

