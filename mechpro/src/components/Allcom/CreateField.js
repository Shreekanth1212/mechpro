import React, { useState } from 'react';


export default function CreateField({ onAdd }) {
  const [name, setName] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (name.trim()) {
      onAdd({ name });
      setName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-field-container">
      <input
        className="create-field-input"
        placeholder="New Field Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button type="submit" className="create-field-btn">
        Add
      </button>
    </form>
  );
}
