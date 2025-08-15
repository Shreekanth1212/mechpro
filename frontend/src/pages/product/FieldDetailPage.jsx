import { useState } from 'react';
import ImageGallery from "../../components/ImageGallery";
const FieldDetailPage = ({ product, field, onAddSubfield, onBackToProductDetail }) => {
    const [showSubfieldForm, setShowSubfieldForm] = useState(false);
    const [subfieldName, setSubfieldName] = useState('');
    const [subfieldDescription, setSubfieldDescription] = useState('');
    const [subfieldImages, setSubfieldImages] = useState([]);
    const [subfieldError, setSubfieldError] = useState('');
    const [subfieldSuccessMessage, setSubfieldSuccessMessage] = useState('');
    const handleShowSubfieldForm = (value) => {
        setShowSubfieldForm(value);
        setSubfieldError('');
        setSubfieldSuccessMessage('');
    }
    const [previewImages, setPreviewImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        setSubfieldImages(prev => {
            const combined = [...prev, ...files];
            if (combined.length > 5) {
                setSubfieldError('You can upload a maximum of 5 images.');
                return combined.slice(0, 5);
            }
            return combined;
        });

        setPreviewImages(prev => {
            const combined = [...prev, ...files.map(file => URL.createObjectURL(file))];
            return combined.slice(0, 5);
        });

        e.target.value = '';
    };


    const handleRemoveImage = (indexToRemove) => {
        setSubfieldImages(prev => prev.filter((_, i) => i !== indexToRemove));
        setPreviewImages(prev => prev.filter((_, i) => i !== indexToRemove));
    };
    const handleAddSubfieldSubmit = async (e) => {
        e.preventDefault();
        setSubfieldError('');
        setSubfieldSuccessMessage('');

        if (!subfieldName.trim() || !subfieldDescription.trim()) {
            setSubfieldError('Subfield name and description are required.');
            return;
        }

        const formData = new FormData();
        formData.append("name", subfieldName);
        formData.append("description", subfieldDescription);
        subfieldImages.forEach(file => formData.append("images", file));

        const success = await onAddSubfield(product._id, field._id, formData);

        if (success) {
            setSubfieldSuccessMessage('Subfield added successfully!');
            setSubfieldName('');
            setSubfieldDescription('');
            setSubfieldImages([]);
            setPreviewImages([]);
            setTimeout(() => handleShowSubfieldForm(false), 1500);
        } else {
            setSubfieldError('Failed to add subfield. Please try again.');
        }
    };


    return (
        <main className="flex-grow flex flex-col items-center p-4 w-full">
            <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <button
                        onClick={onBackToProductDetail}
                        className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-bold focus:outline-none flex items-center gap-1"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to {product.name} Details
                    </button>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white flex-grow text-center">{field.name} Details</h3>
                    <button
                        onClick={() => handleShowSubfieldForm(!showSubfieldForm)}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75 transition duration-300 ease-in-out transform hover:scale-105"
                        aria-label={showSubfieldForm ? 'Cancel Add Subfield' : 'Add New Subfield'}
                    >
                        {showSubfieldForm ? 'Cancel' : 'Add New Subfield'}
                    </button>
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-6 border-b pb-4 border-gray-200 dark:border-gray-700">
                    Field ID: {field._id}
                </p>

                {showSubfieldForm && (
                    <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg mb-6">
                        <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Add New Subfield</h4>
                        <form onSubmit={handleAddSubfieldSubmit}>
                            <div className="mb-4">
                                <label htmlFor="subfieldName" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                                    Subfield Name
                                </label>
                                <input
                                    type="text"
                                    id="subfieldName"
                                    className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 dark:bg-gray-600 dark:text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
                                    placeholder="e.g., Sensor Type"
                                    value={subfieldName}
                                    onChange={(e) => setSubfieldName(e.target.value)}
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="subfieldDescription" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                                    Subfield Description
                                </label>
                                <textarea
                                    id="subfieldDescription"
                                    className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 dark:bg-gray-600 dark:text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200 h-24 resize-none"
                                    placeholder="Describe this subfield..."
                                    value={subfieldDescription}
                                    onChange={(e) => setSubfieldDescription(e.target.value)}
                                ></textarea>
                            </div>
                            <div className="mb-6">
                                <label htmlFor="subfieldImages" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                                    Upload Images (up to 5)
                                </label>
                                <input
                                    type="file"
                                    id="subfieldImages"
                                    className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 dark:bg-gray-600 dark:text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
                                    accept="image/*"
                                    capture="environment"
                                    multiple
                                    onChange={handleImageChange}
                                />
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {previewImages.map((imageSrc, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                onClick={() => setSelectedImage(imageSrc)}
                                                src={imageSrc}
                                                alt={`Subfield ${index}`}
                                                className="h-20 w-20 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(index)}
                                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold -mt-2 -mr-2 hover:bg-red-600 transition duration-200"
                                                aria-label="Remove image"
                                            >
                                                X
                                            </button>
                                        </div>
                                    ))}
                                </div>

                            </div>
                            <button
                                type="submit"
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75 transition duration-300 ease-in-out transform hover:scale-105"
                            >
                                Create Subfield
                            </button>
                            {subfieldError && <p className="text-red-500 text-xs italic mt-4 text-center">{subfieldError}</p>}
                            {subfieldSuccessMessage && <p className="text-green-500 text-xs italic mt-4 text-center">{subfieldSuccessMessage}</p>}
                        </form>
                    </div>
                )}

                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Subfields</h3>
                {field.subfields.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center">No subfields added for this field yet. Click "Add New Subfield" to create one.</p>
                ) : (
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {field.subfields.map(subfield => (
                            <li key={subfield._id} className="py-4">
                                <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">{subfield.name}</h4>
                                <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">{subfield.description}</p>
                                {subfield.images.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {subfield.images.map((imgSrc, imgIndex) => (
                                            <img
                                                key={imgIndex}
                                                src={imgSrc.image}
                                                alt={`Subfield Image ${imgIndex + 1}`}
                                                className="h-16 w-16 object-cover rounded-md border border-gray-300 dark:border-gray-600 cursor-pointer"
                                                onClick={() => setSelectedImage(imgSrc.image)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {selectedImage && <ImageGallery selectedImage={selectedImage} closeImage={() => setSelectedImage(null)} />}
        </main>
    );
};

export default FieldDetailPage;