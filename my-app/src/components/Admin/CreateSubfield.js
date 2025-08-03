import React, { useState } from 'react';

export default function CreateSubfield({ onAdd }) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (name.trim()) {
      onAdd({ name, description: desc });
      setName('');
      setDesc('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-inline-vertical">
      <input
        placeholder="Subfield Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <input
        placeholder="Description"
        value={desc}
        onChange={e => setDesc(e.target.value)}
      />
      <button>Add</button>
    </form>
  );
}
