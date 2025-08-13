import Product from "../models/product.model.js";
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const createProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const addProductField = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        product.fields.push({ name });
        await product.save();

        res.status(201).json(product);
    } catch (error) {
        console.error("Error adding product field:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const addProductSubField = async (req, res) => {
    try {
        const { id, fieldId } = req.params;
        const { name, description } = req.body;
        const uploadedFileNames = req.uploadedFileNames || [];

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const field = product.fields.id(fieldId);
        if (!field) {
            return res.status(404).json({ message: "Field not found" });
        }

        const images = uploadedFileNames.map(filePath => ({
            image: filePath,
            reviewImage: null
        }));


        field.subfields.push({ name, description, images });
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        console.error("Error adding product subfield:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
