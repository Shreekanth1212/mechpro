import React, { useState } from 'react';


export default function CreateProject({ onAdd }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      alert('Please fill out both name and description.');
      return;
    }
    setLoading(true);
    try {
      await onAdd({ name, description });
      setName('');
      setDescription('');
    } catch (error) {
      console.error(error);
      alert('Error saving project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-project-container">
      <input
        className="create-project-input"
        placeholder="New Project Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        className="create-project-textarea"
        placeholder="Project Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button
        type="submit"
        className="create-project-btn"
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Add'}
      </button>
    </form>
  );
}
