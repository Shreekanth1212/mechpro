import multer from "multer";
import fs from "fs";
import AWS from "aws-sdk";

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

// Multer temp storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "tmp/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

/**
 * Middleware to upload an image to S3 and store filename in req.uploadedFileName
 */
export const uploadImageMiddleware = [
  upload.single("image"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const fileContent = fs.readFileSync(req.file.path);
      const fileName = `uploads/${Date.now()}-${req.file.originalname}`;

      const params = {
        Bucket: process.env.AWS_BUCKET,
        Key: fileName,
        Body: fileContent,
        ContentType: req.file.mimetype,
        ACL: "private"
      };

      await s3.upload(params).promise();

      fs.unlinkSync(req.file.path);

      req.uploadedFileName = fileName;
      next();
    } catch (err) {
      console.error("Image upload error:", err);
      return res.status(500).json({ error: "Image upload failed" });
    }
  }
];

/**
 * Function to get a signed URL for a stored file
 */
export const getImageUrl = (fileName) => {
  if (!fileName) return null;

  const params = {
    Bucket: process.env.AWS_BUCKET,
    Key: fileName,
    Expires: 60 * 5 // 5 minutes
  };

  return s3.getSignedUrl("getObject", params);
};
