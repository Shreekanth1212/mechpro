import { useState } from "react";
import ProductPage from "../product/ProductPage";
const ProductList = ({ products, onSaveProduct, onDeleteProduct, selectedProductToEdit, setSelectedProductToEdit, onViewProductDetails, onReviewProduct }) => {
    const [isAddingProduct, setIsAddingProduct] = useState(false);
    const showProductForm = isAddingProduct || selectedProductToEdit !== null;
    const handleAddNewProductClick = () => {
        setSelectedProductToEdit(null); 
        setIsAddingProduct(true);
    };
    const handleEditProductClick = (product) => {
        setSelectedProductToEdit(product);
        setIsAddingProduct(false); 
    };
    const handleCancelProductForm = () => {
        setSelectedProductToEdit(null);
        setIsAddingProduct(false);
    };

    return (
        <main className="flex-grow flex flex-col items-center p-4 w-full">
            <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Products</h3> 
                    <button
                        onClick={showProductForm ? handleCancelProductForm : handleAddNewProductClick}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75 transition duration-300 ease-in-out transform hover:scale-105"
                        aria-label={showProductForm ? 'View Products List' : 'Add New Product'}
                    >
                        {showProductForm ? 'View Products' : 'Add New Product'}
                    </button>
                </div>

                {showProductForm ? (
                    <ProductPage
                        productToEdit={selectedProductToEdit} 
                        onSaveProduct={onSaveProduct}
                        onCancelEdit={handleCancelProductForm}
                    />
                ) : (
                    <div className="w-full">
                        {products.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400 text-center col-span-full">No products added yet. Click "Add New Product" to get started!</p>
                        ) : (
                            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                {products.map(product => (
                                    <li key={product._id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                        <div className="mb-2 sm:mb-0 sm:mr-4 cursor-pointer hover:text-blue-500 dark:hover:text-blue-400"
                                            onClick={() => onViewProductDetails(product)}>
                                            <h4 className="text-xl font-semibold text-gray-800 dark:text-white">{product.name}</h4>
                                            <p className="text-gray-600 dark:text-gray-300 text-sm">{product.description}</p>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                onClick={() => handleEditProductClick(product)}
                                                className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-200"
                                                aria-label="Edit product"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                                    <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 000-2H4a4 4 0 00-4 4v10a4 4 0 004 4h10a4 4 0 004-4v-4a1 1 0 10-2 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => onDeleteProduct(product._id)}
                                                className="bg-red-500 hover:bg-red-600 text-white text-sm font-bold p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 transition duration-200"
                                                aria-label="Delete product"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm1 5a1 1 0 100 2h4a1 1 0 100-2H8z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => onReviewProduct(product)}
                                                className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-bold p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-75 transition duration-200"
                                                aria-label="Review product"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.5a1 1 0 01-2 0V3a1 1 0 011-1zm0 14a1 1 0 01-1-1v-1.5a1 1 0 012 0V15a1 1 0 01-1 1zM3 10a1 1 0 01-1-1V8a1 1 0 012 0v1a1 1 0 01-1 1zm14 0a1 1 0 01-1-1V8a1 1 0 012 0v1a1 1 0 01-1 1zM7.464 6.343a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zm5.656 5.657a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zm-7.071 0a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM12.536 6.343a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 0zM10 14a4 4 0 100-8 4 4 0 000 8z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
};

export default ProductList;