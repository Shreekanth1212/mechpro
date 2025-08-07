import React, { useEffect } from 'react';
import CreateField from './CreateField';
import axios from 'axios';

export default function FieldList({ project, setProjects, onSelectField }) {
  useEffect(() => {
    console.log('📦 FieldList received project:', project);
  }, [project]);

  // Safely handle case where project is not yet selected or loading
  if (!project) {
    return (
      <div className="field-list">
        <p style={{ color: 'gray' }}>⚠️ No project selected.</p>
      </div>
    );
  }

  const addField = async (field) => {
    try {
      const newField = {
        ...field,
        id: Date.now(),
        subfields: []
      };

      const updatedProject = {
        ...project,
        fields: [...(project.fields || []), newField]  // default to [] if undefined
      };

      console.log('📤 Updating project with new field:', updatedProject);

      await axios.put(`http://localhost:5000/projects/${project.id}`, updatedProject);

      setProjects(prev =>
        prev.map(p => (p.id === project.id ? updatedProject : p))
      );
    } catch (err) {
      console.error('❌ Failed to add field:', err);
      alert('Error adding field. Check console for details.');
    }
  };

  return (
    <div className="field-list">
      <CreateField onAdd={addField} />

      {(project.fields && project.fields.length > 0) ? (
        <ul>
          {project.fields.map((field) => (
            <li
              key={field.id}
              className="item"
              onClick={() => onSelectField(field)}
            >
              {field.name}
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ color: 'gray' }}>📭 No fields yet. Add one above.</p>
      )}
    </div>
  );
}
