import express from "express";
import { authenticateUser } from "../middleware/authHandler.js";
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, addProductField, addProductSubField } from "../controllers/product.controller.js";
import { uploadMultipleImages } from "../middleware/imageHandler.js";

const router = express.Router();

router.get("/", authenticateUser, getAllProducts);
router.get("/:id", authenticateUser, getProductById);
router.post("/", authenticateUser, createProduct);
router.put("/:id", authenticateUser, updateProduct);
router.post("/:id/fields", authenticateUser, addProductField);
router.post("/:id/fields/:fieldId/subfields", authenticateUser, uploadMultipleImages, addProductSubField);
router.delete("/:id", authenticateUser, deleteProduct);

export default router;