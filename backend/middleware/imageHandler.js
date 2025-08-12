import multer from "multer";
import s3 from "../config/s3.js";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const uploadSingleImage = [
  upload.single("image"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const fileName = `uploads/${Date.now()}-${req.file.originalname}`;
      const params = {
        Bucket: process.env.AWS_BUCKET,
        Key: fileName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
        ACL: "private"
      };

      await s3.upload(params).promise();

      req.uploadedFileName = fileName;
      next();
    } catch (err) {
      console.error("Image upload error:", err);
      res.status(500).json({ error: "Image upload failed" });
    }
  }
];

export const uploadMultipleImages = [
  upload.array("images", 10),
  async (req, res, next) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      const uploadResults = await Promise.all(
        req.files.map(file => {
          const fileName = `uploads/${Date.now()}-${file.originalname}`;
          const params = {
            Bucket: process.env.AWS_BUCKET,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: "private"
          };
          return s3.upload(params).promise().then(() => fileName);
        })
      );

      req.uploadedFileNames = uploadResults;
      next();
    } catch (err) {
      console.error("Multiple image upload error:", err);
      res.status(500).json({ error: "Image upload failed" });
    }
  }
];

export const getImageUrl = (fileName) => {
  if (!fileName) return null;
  const params = {
    Bucket: process.env.AWS_BUCKET,
    Key: fileName,
    Expires: 60 * 60
  };
  return s3.getSignedUrl("getObject", params);
};
