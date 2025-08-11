import React, { useState, useRef } from "react";
import axios from "axios";
import CreateSubfield from "./CreateSubfield";


export default function SubfieldList({ field, project, setProjects }) {
  const [capturingSubfieldId, setCapturingSubfieldId] = useState(null);
  const [editingSubfield, setEditingSubfield] = useState(null);
  const videoRef = useRef();

  const API_BASE = "http://localhost:5000"; // change to real backend later

  /** Add new subfield */
  const addSubfield = async (subfield) => {
    try {
      const newSubfield = {
        ...subfield,
        id: Date.now(),
        images: [],
      };

      const res = await axios.post(
        `${API_BASE}/projects/${project.id}/fields/${field.id}/subfields`,
        newSubfield
      );

      setProjects((prev) =>
        prev.map((p) =>
          p.id === project.id
            ? {
                ...p,
                fields: p.fields.map((f) =>
                  f.id === field.id
                    ? { ...f, subfields: [...f.subfields, res.data] }
                    : f
                ),
              }
            : p
        )
      );
    } catch (err) {
      console.error("Failed to add subfield", err);
    }
  };

  /** Edit subfield name/description */
  const editSubfield = async (subfieldId, updates) => {
    try {
      const res = await axios.patch(
        `${API_BASE}/projects/${project.id}/fields/${field.id}/subfields/${subfieldId}`,
        updates
      );

      setProjects((prev) =>
        prev.map((p) =>
          p.id === project.id
            ? {
                ...p,
                fields: p.fields.map((f) =>
                  f.id === field.id
                    ? {
                        ...f,
                        subfields: f.subfields.map((sf) =>
                          sf.id === subfieldId ? res.data : sf
                        ),
                      }
                    : f
                ),
              }
            : p
        )
      );
      setEditingSubfield(null);
    } catch (err) {
      console.error("Failed to edit subfield", err);
    }
  };

  /** Remove image */
  const removeImage = async (subfieldId, imageUrl) => {
    try {
      await axios.delete(
        `${API_BASE}/projects/${project.id}/fields/${field.id}/subfields/${subfieldId}/images`,
        { data: { imageUrl } }
      );

      setProjects((prev) =>
        prev.map((p) =>
          p.id === project.id
            ? {
                ...p,
                fields: p.fields.map((f) =>
                  f.id === field.id
                    ? {
                        ...f,
                        subfields: f.subfields.map((sf) =>
                          sf.id === subfieldId
                            ? {
                                ...sf,
                                images: sf.images.filter((img) => img !== imageUrl),
                              }
                            : sf
                        ),
                      }
                    : f
                ),
              }
            : p
        )
      );
    } catch (err) {
      console.error("Failed to remove image", err);
    }
  };

  /** Compress image before upload */
  const compressImage = (file) =>
    new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e) => (img.src = e.target.result);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const MAX_SIZE = 800;
        let width = img.width;
        let height = img.height;
        if (width > height && width > MAX_SIZE) {
          height *= MAX_SIZE / width;
          width = MAX_SIZE;
        } else if (height > MAX_SIZE) {
          width *= MAX_SIZE / height;
          height = MAX_SIZE;
        }
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        let quality = 0.8;
        let dataUrl = canvas.toDataURL("image/jpeg", quality);
        while (dataUrl.length > 300 * 1024 && quality > 0.1) {
          quality -= 0.05;
          dataUrl = canvas.toDataURL("image/jpeg", quality);
        }
        fetch(dataUrl)
          .then((res) => res.blob())
          .then((blob) =>
            resolve(new File([blob], file.name, { type: "image/jpeg" }))
          );
      };
      reader.readAsDataURL(file);
    });

  /** Upload image */
  const uploadImage = async (subfieldId, file) => {
    const currentSubfield = project.fields
      .find((f) => f.id === field.id)
      ?.subfields.find((sf) => sf.id === subfieldId);

    if (currentSubfield.images.length >= 4) {
      alert("Maximum 4 images allowed");
      return;
    }

    try {
      const compressedFile = await compressImage(file);
      const formData = new FormData();
      formData.append("image", compressedFile);

      const res = await axios.post(
        `${API_BASE}/projects/${project.id}/fields/${field.id}/subfields/${subfieldId}/images`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const newImageUrl = res.data.imageUrl;
      setProjects((prev) =>
        prev.map((p) =>
          p.id === project.id
            ? {
                ...p,
                fields: p.fields.map((f) =>
                  f.id === field.id
                    ? {
                        ...f,
                        subfields: f.subfields.map((sf) =>
                          sf.id === subfieldId
                            ? { ...sf, images: [...sf.images, newImageUrl] }
                            : sf
                        ),
                      }
                    : f
                ),
              }
            : p
        )
      );
    } catch (err) {
      console.error("Image upload failed", err);
    }
  };

  /** Camera */
  const startCamera = async (subfieldId) => {
    setCapturingSubfieldId(subfieldId);
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
    videoRef.current.play();
  };

  const takePhoto = async () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg")
    );
    const file = new File([blob], "captured.jpg", { type: "image/jpeg" });

    await uploadImage(capturingSubfieldId, file);
    stopCamera();
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) stream.getTracks().forEach((t) => t.stop());
    videoRef.current.srcObject = null;
    setCapturingSubfieldId(null);
  };

  const currentField = project.fields.find((f) => f.id === field.id);

  return (
    <div className="subfield-list">
      <h4>Subfields of {currentField?.name}</h4>
      <CreateSubfield onAdd={addSubfield} />

      <ul>
        {(currentField?.subfields || []).map((sf) => (
          <li key={sf.id}>
            {editingSubfield === sf.id ? (
              <>
                <input
                  value={sf.name}
                  onChange={(e) =>
                    editSubfield(sf.id, { name: e.target.value })
                  }
                />
                <textarea
                  value={sf.description}
                  onChange={(e) =>
                    editSubfield(sf.id, { description: e.target.value })
                  }
                />
                <button onClick={() => setEditingSubfield(null)}>Done</button>
              </>
            ) : (
              <>
                <strong>{sf.name}</strong> <em>{sf.description}</em>
                <button onClick={() => setEditingSubfield(sf.id)}>✏️ Edit</button>
              </>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={(e) => uploadImage(sf.id, e.target.files[0])}
            />
            <button onClick={() => startCamera(sf.id)}>📸 Take Photo</button>

            <div className="image-list">
              {(sf.images || []).map((img, idx) => (
                <div key={idx} className="image-item">
                  <img src={img} alt="" />
                  <button onClick={() => removeImage(sf.id, img)}>❌</button>
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>

      {capturingSubfieldId && (
        <div className="camera-overlay">
          <video ref={videoRef} />
          <button onClick={takePhoto}>📸 Capture</button>
          <button onClick={stopCamera}>❌ Cancel</button>
        </div>
      )}
    </div>
  );
}
