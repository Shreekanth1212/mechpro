import React, { useState } from 'react';

export default function CreateProject({ onAdd }) {
  const [name, setName] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (name.trim()) {
      onAdd({ name });
      setName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="pms-form-inline">
      <input
        placeholder="New Project Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button type="submit">Add</button>
    </form>
  );
}