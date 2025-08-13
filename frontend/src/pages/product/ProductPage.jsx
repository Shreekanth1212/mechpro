import { useState, useEffect } from "react";
const ProductPage = ({ productToEdit, onSaveProduct, onCancelEdit }) => {
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    useEffect(() => {
        if (productToEdit) {
            setProductName(productToEdit.name);
            setProductDescription(productToEdit.description);
            setSuccessMessage('');
        } else {
            setProductName('');
            setProductDescription('');
            setSuccessMessage('');
        }
        setError('');
    }, [productToEdit]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        if (!productName || !productDescription) {
            setError('Product name and description are required.');
            return;
        }
        const productData = productToEdit ? { ...productToEdit, name: productName, description: productDescription } : { name: productName, description: productDescription };
        const success = await onSaveProduct(productData);
        if (success) {
            setSuccessMessage(productToEdit ? 'Product updated successfully!' : 'Product added successfully!');
            if (!productToEdit) {
                setProductName('');
                setProductDescription('');
            }
            setTimeout(() => onCancelEdit(), 1500);
        } else {
            setError('Failed to save product. Please try again.');
        }
    };
    return (
        <div className="flex justify-center items-center p-4">
            <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
                <h3 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">
                    {productToEdit ? 'Edit Product' : 'Add New Product'}
                </h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="productName" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                            Product Name
                        </label>
                        <input
                            type="text"
                            id="productName"
                            className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 dark:bg-gray-700 dark:text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
                            placeholder="e.g., Ergonomic Keyboard"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="productDescription" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                            Product Description
                        </label>
                        <textarea
                            id="productDescription"
                            className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 dark:bg-gray-700 dark:text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200 h-32 resize-none"
                            placeholder="Provide a detailed description of the product..."
                            value={productDescription}
                            onChange={(e) => setProductDescription(e.target.value)}
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75 transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        {productToEdit ? 'Save Changes' : 'Add Product'}
                    </button>
                    {error && <p className="text-red-500 text-xs italic mt-4 text-center">{error}</p>}
                    {successMessage && <p className="text-green-500 text-xs italic mt-4 text-center">{successMessage}</p>}
                </form>
                <div className="text-center mt-6">
                    <button
                        onClick={onCancelEdit}
                        className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-bold focus:outline-none"
                    >
                        ← {productToEdit ? 'Cancel Edit' : 'Back to Product List'}
                    </button>
                </div>
            </div>
        </div>
    );
};
export default ProductPage;