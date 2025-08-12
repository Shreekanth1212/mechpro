import React, { useState } from 'react';

export default function CreateSubfield({ onAdd }) {
  const [subfield, setSubfield] = useState({ name: '', description: '' });

  const handleAdd = () => {
    if (!subfield.name.trim()) return;
    onAdd(subfield);
    setSubfield({ name: '', description: '' });
  };

  return (
    <div className="create-subfield-container">
      <input
        type="text"
        value={subfield.name}
        onChange={e => setSubfield({ ...subfield, name: e.target.value })}
        placeholder="Subfield Name"
        className="create-subfield-input"
      />
      <textarea
        value={subfield.description}
        onChange={e => setSubfield({ ...subfield, description: e.target.value })}
        placeholder="Subfield Description"
        className="create-subfield-textarea"
      />
      <button onClick={handleAdd} className="create-subfield-btn">
        Add Subfield
      </button>
    </div>
  );
}
