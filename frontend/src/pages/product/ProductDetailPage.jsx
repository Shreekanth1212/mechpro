import { useState } from "react";
const ProductDetailPage = ({ product, onAddField, onBackToProducts, onSelectField }) => {

    const [showFieldForm, setShowFieldForm] = useState(false);
    const [fieldName, setFieldName] = useState('');
    const [fieldError, setFieldError] = useState('');
    const [fieldSuccessMessage, setFieldSuccessMessage] = useState('');

    const handleShowFieldForm = (value) => {
        setShowFieldForm(value);
        setFieldError('');
        setFieldSuccessMessage('');
    };

    const handleAddFieldSubmit = async (e) => {
        e.preventDefault();
        setFieldError('');
        setFieldSuccessMessage('');

        if (!fieldName.trim()) {
            setFieldError('Field name cannot be empty.');
            return;
        }

        const success = await onAddField(product._id, fieldName);
        if (success) {
            setFieldSuccessMessage('Field added successfully!');
            setFieldName('');
            setTimeout(() => handleShowFieldForm(false), 1500);
        } else {
            setFieldError('Failed to add field. Please try again.');
        }
    };

    return (
        <main className="flex-grow flex flex-col items-center p-4 w-full">
            <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <button
                        onClick={onBackToProducts}
                        className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-bold focus:outline-none flex items-center gap-1"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Products
                    </button>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white flex-grow text-center">{product.name} Details</h3>
                    <button
                        onClick={() => handleShowFieldForm(!showFieldForm)}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 transition duration-300 ease-in-out transform hover:scale-105"
                        aria-label={showFieldForm ? 'Cancel Add Field' : 'Add New Field'}
                    >
                        {showFieldForm ? 'Cancel' : 'Add New Field'}
                    </button>
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-6 border-b pb-4 border-gray-200 dark:border-gray-700">
                    {product.description}
                </p>

                {showFieldForm && (
                    <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg mb-6">
                        <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Add New Field</h4>
                        <form onSubmit={handleAddFieldSubmit}>
                            <div className="mb-4">
                                <label htmlFor="fieldName" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                                    Field Name
                                </label>
                                <input
                                    type="text"
                                    id="fieldName"
                                    className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 dark:bg-gray-600 dark:text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                                    placeholder="e.g., Technical Specs"
                                    value={fieldName}
                                    onChange={(e) => setFieldName(e.target.value)}
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 transition duration-300 ease-in-out transform hover:scale-105"
                            >
                                Create Field
                            </button>
                            {fieldError && <p className="text-red-500 text-xs italic mt-4 text-center">{fieldError}</p>}
                            {fieldSuccessMessage && <p className="text-green-500 text-xs italic mt-4 text-center">{fieldSuccessMessage}</p>}
                        </form>
                    </div>
                )}

                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Fields</h3>
                {product.fields.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center">No fields added for this product yet. Click "Add New Field" to create one.</p>
                ) : (
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {product.fields.map(field => (
                            <li key={field._id} className="py-3 flex justify-between items-center">
                                <span className="text-lg text-gray-800 dark:text-white cursor-pointer hover:text-blue-500 dark:hover:text-blue-400"
                                    onClick={() => onSelectField(field)}> {/* Calls onSelectField to navigate to FieldDetailPage */}
                                    {field.name}
                                </span>
                                {/* Add Edit/Delete icons for fields here in the future */}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </main>
    );
};
export default ProductDetailPage;