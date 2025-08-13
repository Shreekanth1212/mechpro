import { useState } from "react";

export default function ImageGallery({ subfield }) {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div>
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

      {/* Full-screen viewer */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Full size"
            className="max-w-full max-h-full object-contain"
          />
          <button
            className="absolute top-4 right-4 text-white text-3xl"
            onClick={() => setSelectedImage(null)}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
