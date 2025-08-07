import React, { useState } from 'react';

export default function CreateSubfield({ onAdd }) {
  const [subfield, setSubfield] = useState({ name: '', description: '' });

  const handleAdd = () => {
    if (!subfield.name.trim()) return;
    onAdd(subfield);
    setSubfield({ name: '', description: '' });
  };

  return (
    <div className="create-subfield">
      <input
        type="text"
        value={subfield.name}
        onChange={e => setSubfield({ ...subfield, name: e.target.value })}
        placeholder="Subfield Name"
        className="pms-input"
      />
      <textarea
        value={subfield.description}
        onChange={e => setSubfield({ ...subfield, description: e.target.value })}
        placeholder="Subfield Description"
        className="pms-textarea"
      />
      <button onClick={handleAdd} className="pms-add-btn">Add Subfield</button>
    </div>
  );
}
