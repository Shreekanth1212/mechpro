import React, { useRef } from "react";
import imageCompression from "browser-image-compression";

export default function ReviewSubfield({ fieldId, subfield, onUpdate }) {
  const fileInputRef = useRef(null);

  const handleFileChange = async e => {
    const file = e.target.files[0];
    if (!file) return;

    if ((subfield.images?.length || 0) >= 4) {
      alert("Max 4 images allowed per subfield.");
      return;
    }

    const compressed = await imageCompression(file, { maxSizeMB: 0.3, maxWidthOrHeight: 800 });
    const base64 = await toBase64(compressed);

    const updatedImages = [...(subfield.images || []), { type: "review", data: base64 }];
    onUpdate(fieldId, subfield.id, { images: updatedImages });
  };

  const handleDelete = idx => {
    const updatedImages = subfield.images.filter((_, i) => i !== idx);
    onUpdate(fieldId, subfield.id, { images: updatedImages });
  };

  const handleCommentChange = e => {
    onUpdate(fieldId, subfield.id, { comment: e.target.value });
  };

  const toBase64 = file =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = err => reject(err);
    });

  return (
    <div className="pms-subfield-review">
      <h4>{subfield.name}</h4>
      <div className="pms-image-list">
        {(subfield.images || []).map((img, idx) => (
          <div key={idx} className="pms-image-item">
            <img src={img.data} alt="" />
            <button onClick={() => handleDelete(idx)}>🗑 Delete</button>
          </div>
        ))}
      </div>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <button onClick={() => fileInputRef.current.click()}>📷 Upload Review Image</button>
      <textarea
        placeholder="Add comment..."
        value={subfield.comment || ""}
        onChange={handleCommentChange}
      />
    </div>
  );
}