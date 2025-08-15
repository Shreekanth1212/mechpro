import { useState, useEffect } from "react";
import ImageGallery from "../../components/ImageGallery";

const ProductReviewPage = ({ product, onSaveReviewImage, onBackToProducts }) => {
    const [reviewImageFiles, setReviewImageFiles] = useState({});
    const [reviewImagePreviews, setReviewImagePreviews] = useState({});
    const [reviewErrors, setReviewErrors] = useState({});
    const [reviewSuccessMessages, setReviewSuccessMessages] = useState({});
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        setReviewImageFiles({});
        setReviewImagePreviews({});
        setReviewErrors({});
        setReviewSuccessMessages({});
    }, [product._id]);

    const handleReviewImageChange = (e, imageId) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setReviewImagePreviews(prev => ({ ...prev, [imageId]: previewUrl }));
            setReviewImageFiles(prev => ({ ...prev, [imageId]: file }));
            setReviewErrors(prev => ({ ...prev, [imageId]: '' }));
        } else {
            setReviewImagePreviews(prev => {
                const newPreviews = { ...prev };
                delete newPreviews[imageId];
                return newPreviews;
            });
            setReviewImageFiles(prev => {
                const newFiles = { ...prev };
                delete newFiles[imageId];
                return newFiles;
            });
        }
    };

    const handleRemoveImage = (imageId) => {
        setReviewImageFiles(prev => {
            const newFiles = { ...prev };
            delete newFiles[imageId];
            return newFiles;
        });
        setReviewImagePreviews(prev => {
            const newPreviews = { ...prev };
            delete newPreviews[imageId];
            return newPreviews;
        });
    };

    const handleSaveIndividualReviewImage = async (productId, fieldId, subfieldId, imageId) => {
        setReviewErrors(prev => ({ ...prev, [imageId]: '' }));
        setReviewSuccessMessages(prev => ({ ...prev, [imageId]: '' }));

        const file = reviewImageFiles[imageId];
        if (!file) {
            setReviewErrors(prev => ({ ...prev, [imageId]: 'Please select an image to save.' }));
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        const success = await onSaveReviewImage(productId, fieldId, subfieldId, imageId, formData);
        if (success) {
            setReviewSuccessMessages(prev => ({ ...prev, [imageId]: 'Review image saved!' }));

            setTimeout(() => {
                setReviewSuccessMessages(prev => {
                    const newMsgs = { ...prev };
                    delete newMsgs[imageId];
                    return newMsgs;
                });
            }, 3000);

            setReviewImagePreviews(prev => {
                const newPreviews = { ...prev };
                delete newPreviews[imageId];
                return newPreviews;
            });
            setReviewImageFiles(prev => {
                const newFiles = { ...prev };
                delete newFiles[imageId];
                return newFiles;
            });
        } else {
            setReviewErrors(prev => ({ ...prev, [imageId]: 'Failed to save review image.' }));
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
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white flex-grow text-center">{product.name} Review</h3>
                    <div></div>
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-6 border-b pb-4 border-gray-200 dark:border-gray-700">
                    Reviewing details for: <span className="font-bold">{product.name}</span>
                </p>

                {product.fields.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center">No fields to review for this product.</p>
                ) : (
                    product.fields.map(field => (
                        <div key={field._id} className="mb-8 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-sm">
                            <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-4 border-b pb-2 border-gray-300 dark:border-gray-600">
                                Field: {field.name}
                            </h4>

                            {field.subfields.length === 0 ? (
                                <p className="text-gray-500 dark:text-gray-400 text-center">No subfields to review in this field.</p>
                            ) : (
                                field.subfields.map(subfield => (
                                    <div key={subfield._id} className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                                        <h5 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Subfield: {subfield.name}</h5>
                                        <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">{subfield.description}</p>

                                        {subfield.images.length === 0 ? (
                                            <p className="text-gray-500 dark:text-gray-400 text-center">No images to review in this subfield.</p>
                                        ) : (
                                            subfield.images.map(imageObj => (
                                                <div key={imageObj._id} className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 mb-4">
                                                    <h6 className="text-md font-medium text-gray-800 dark:text-white mb-3 text-center">Image Review</h6>
                                                    <div className="flex flex-col md:flex-row justify-around md:items-start item-center gap-8 mb-4">

                                                        <div className="flex flex-col items-center">
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Original</p>
                                                            <img
                                                                src={imageObj.image}
                                                                alt="Original"
                                                                className="max-w-full h-auto max-h-48 object-contain rounded-lg border border-gray-400 dark:border-gray-500 cursor-pointer"
                                                                onClick={() => setSelectedImage(imageObj.image)}
                                                            />
                                                        </div>

                                                        <div className="flex flex-col items-center">
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Review</p>

                                                            {reviewImagePreviews[imageObj._id] ? (
                                                                <div className="relative">
                                                                    <img
                                                                        onClick={() => setSelectedImage(reviewImagePreviews[imageObj._id])}
                                                                        src={reviewImagePreviews[imageObj._id]}
                                                                        alt={`Preview ${imageObj._id}`}
                                                                        className="max-w-full h-auto max-h-48 object-contain rounded-lg border border-blue-500 dark:border-blue-400 cursor-pointer"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleRemoveImage(imageObj._id)}
                                                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold -mt-2 -mr-2 hover:bg-red-600"
                                                                    >
                                                                        X
                                                                    </button>
                                                                </div>
                                                            ) : imageObj.reviewImage ? (
                                                                <img
                                                                    onClick={() => setSelectedImage(imageObj.reviewImage)}
                                                                    src={imageObj.reviewImage}
                                                                    alt="Review"
                                                                    className="max-w-full h-auto max-h-48 object-contain rounded-lg border border-green-500 dark:border-green-400 cursor-pointer"
                                                                />
                                                            ) : (
                                                                <div className="h-48 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400">
                                                                    No Review Image
                                                                </div>
                                                            )}

                                                            {!reviewImageFiles[imageObj._id] && (
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    capture="environment"
                                                                    onChange={(e) => handleReviewImageChange(e, imageObj._id)}
                                                                    className="shadow border rounded-lg w-48 py-3 px-4 mt-4 text-gray-700 dark:bg-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                                />
                                                            )}

                                                            {reviewImageFiles[imageObj._id] && (
                                                                <button
                                                                    onClick={() => handleSaveIndividualReviewImage(product._id, field._id, subfield._id, imageObj._id)}
                                                                    className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg w-48"
                                                                >
                                                                    Save Review Image
                                                                </button>
                                                            )}

                                                            {reviewErrors[imageObj._id] && (
                                                                <p className="text-red-500 text-xs italic mt-2 text-center w-48">
                                                                    {reviewErrors[imageObj._id]}
                                                                </p>
                                                            )}

                                                            {reviewSuccessMessages[imageObj._id] && (
                                                                <p className="text-green-500 text-xs italic mt-2 text-center w-48">
                                                                    {reviewSuccessMessages[imageObj._id]}
                                                                </p>
                                                            )}
                                                        </div>

                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    ))
                )}
            </div>

            {selectedImage && <ImageGallery selectedImage={selectedImage} closeImage={() => setSelectedImage(null)} />}
        </main>
    );
};

export default ProductReviewPage;
