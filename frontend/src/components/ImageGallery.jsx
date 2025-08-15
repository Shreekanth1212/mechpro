export default function ImageGallery({ selectedImage, closeImage }) {
  return (
    <div>
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          onClick={closeImage}
        >
          <img
            src={selectedImage}
            alt="Full size"
            className="max-w-full max-h-full object-contain"
          />
          <button
            className="absolute top-4 right-4 text-white text-3xl"
            onClick={closeImage}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
