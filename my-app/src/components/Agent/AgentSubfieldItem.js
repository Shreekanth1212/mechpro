import React, { useState } from 'react';
import axios from 'axios';

export default function AgentSubfieldItem({ project, field, subfield, setProjects }) {
  const [status, setStatus] = useState(subfield?.agentStatus || '');
  const [comment, setComment] = useState(subfield?.agentComment || '');
  const [agentImages, setAgentImages] = useState(subfield?.agentImages || []);

  if (!subfield) {
    return <div style={{ color: 'red' }}>Error: Subfield data is missing.</div>;
  }

  const updateProject = async (updatedFields) => {
    const updatedProject = { ...project, fields: updatedFields };
    try {
      await axios.put(`http://13.233.122.10:5000/projects/${project.id}`, updatedProject);
      setProjects(prev => prev.map(p => (p.id === project.id ? updatedProject : p)));
    } catch (error) {
      console.error('Failed to update project:', error);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setStatus(newStatus);
    const updatedFields = project.fields.map(f =>
      f.id === field.id
        ? {
            ...f,
            subfields: f.subfields.map(sf =>
              sf.id === subfield.id ? { ...sf, agentStatus: newStatus } : sf
            )
          }
        : f
    );
    await updateProject(updatedFields);
  };

  const handleCommentChange = async (e) => {
    const text = e.target.value;
    setComment(text);
    const updatedFields = project.fields.map(f =>
      f.id === field.id
        ? {
            ...f,
            subfields: f.subfields.map(sf =>
              sf.id === subfield.id ? { ...sf, agentComment: text } : sf
            )
          }
        : f
    );
    await updateProject(updatedFields);
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result;
      const newImages = [...agentImages, base64];
      setAgentImages(newImages);

      const updatedFields = project.fields.map(f =>
        f.id === field.id
          ? {
              ...f,
              subfields: f.subfields.map(sf =>
                sf.id === subfield.id ? { ...sf, agentImages: newImages } : sf
              )
            }
          : f
      );
      await updateProject(updatedFields);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="agent-subfield p-4 border rounded-lg bg-white shadow mt-2">
      {/* Header */}
      <div className="font-semibold text-lg mb-2">{subfield.name}</div>

      {/* Images in same row */}
      <div className="flex flex-wrap gap-4 mb-2">
        {/* Original Images */}
        {subfield.images && subfield.images.length > 0 && (
          <div>
            <div className="font-medium text-gray-700 mb-1 text-center">Original Images</div>
            <div className="flex gap-2">
              {subfield.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt="original"
                  className="w-24 h-24 object-cover rounded border"
                />
              ))}
            </div>
          </div>
        )}

        {/* Taken Images */}
        {agentImages.length > 0 && (
          <div>
            <div className="font-medium text-gray-700 mb-1 text-center">Taken Images</div>
            <div className="flex gap-2">
              {agentImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt="agent-upload"
                  className="w-24 h-24 object-cover rounded border"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Subfield description below images */}
      <div className="text-gray-500 text-sm mb-3">{subfield.description}</div>

      {/* Status Buttons */}
      <div className="flex items-center gap-3 mb-3">
        <button
          onClick={() => handleStatusChange('pass')}
          className={`px-4 py-1 rounded ${status === 'pass' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
        >
          Pass
        </button>
        <button
          onClick={() => handleStatusChange('fail')}
          className={`px-4 py-1 rounded ${status === 'fail' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
        >
          Fail
        </button>
      </div>

      {/* Upload file */}
      <div className="mb-3">
        <input type="file" accept="image/*" onChange={handleUpload} />
      </div>

      {/* Comment box below all images if failed */}
      {status === 'fail' && (
        <textarea
          placeholder="Add comment..."
          value={comment}
          onChange={handleCommentChange}
          className="w-full border rounded p-2"
        />
      )}
    </div>
  );
}
