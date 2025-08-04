import React, { useState, useRef } from 'react';
import axios from 'axios';
import CreateSubfield from './CreateSubfield';

export default function SubfieldList({ field, project, setProjects }) {
  const [capturingSubfieldId, setCapturingSubfieldId] = useState(null);
  const videoRef = useRef();

  const addSubfield = async subfield => {
    const newSubfield = { ...subfield, id: Date.now(), images: [] };
    const updatedProject = {
      ...project,
      fields: project.fields.map(f =>
        f.id === field.id ? { ...f, subfields: [...f.subfields, newSubfield] } : f
      )
    };
    setProjects(prev => prev.map(p => p.id === project.id ? updatedProject : p));
    await axios.put(`http://13.233.122.10:5000/projects/${project.id}`, updatedProject);
  };

  const handleUpload = (subfieldId, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      await saveImage(subfieldId, reader.result);
    };
    reader.readAsDataURL(file);
  };

  const saveImage = async (subfieldId, base64) => {
    const updatedProject = {
      ...project,
      fields: project.fields.map(f =>
        f.id === field.id
          ? {
              ...f,
              subfields: f.subfields.map(sf =>
                sf.id === subfieldId
                  ? { ...sf, images: [...(sf.images || []), base64] }
                  : sf
              )
            }
          : f
      )
    };
    setProjects(prev => prev.map(p => p.id === project.id ? updatedProject : p));
    await axios.put(`http://13.233.122.10:5000/projects/${project.id}`, updatedProject);
  };

  const startCamera = async (subfieldId) => {
    try {
      setCapturingSubfieldId(subfieldId);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    } catch (error) {
      console.error('Failed to open camera', error);
    }
  };

  const takePhoto = async () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const base64 = canvas.toDataURL('image/jpeg');
    await saveImage(capturingSubfieldId, base64);

    // Stop camera
    const stream = videoRef.current.srcObject;
    stream.getTracks().forEach(track => track.stop());
    videoRef.current.srcObject = null;
    setCapturingSubfieldId(null);
  };

  const cancelCapture = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) stream.getTracks().forEach(track => track.stop());
    videoRef.current.srcObject = null;
    setCapturingSubfieldId(null);
  };

  const currentField = project.fields.find(f => f.id === field.id);

  return (
    <div className="subfield-list">
      <h4 className="subfield-title">Subfields of {currentField?.name}</h4>
      <CreateSubfield onAdd={addSubfield} />
      <ul className="subfield-items">
        {(currentField?.subfields || []).map(sf => (
          <li key={sf.id} className="subfield-item" style={{ marginBottom: '15px' }}>
            <div>
              <strong>{sf.name}</strong> — <span>{sf.description}</span>
            </div>

            {/* Upload from gallery / files */}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={e => handleUpload(sf.id, e.target.files[0])}
              style={{ marginTop: '5px' }}
            />

            {/* Take photo directly */}
            <button onClick={() => startCamera(sf.id)} style={{ marginLeft: '8px' }}>
              📸 Take Photo
            </button>

            <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '5px', gap: '4px' }}>
              {(sf.images || []).map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt="upload"
                  style={{
                    width: '60px',
                    height: '60px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                    border: '1px solid #ccc'
                  }}
                />
              ))}
            </div>
          </li>
        ))}
      </ul>

      {/* Camera preview modal */}
      {capturingSubfieldId && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'
        }}>
          <video ref={videoRef} style={{ width: '80%', maxWidth: '400px', borderRadius: '8px' }} />
          <div style={{ marginTop: '10px' }}>
            <button onClick={takePhoto} style={{ marginRight: '8px' }}>📸 Capture</button>
            <button onClick={cancelCapture}>❌ Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
