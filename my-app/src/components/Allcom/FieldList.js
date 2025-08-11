import React, { useEffect } from 'react';
import CreateField from './CreateField';
import axios from 'axios';


export default function FieldList({ project, setProjects, onSelectField }) {
  useEffect(() => {
    console.log('📦 FieldList received project:', project);
  }, [project]);

  if (!project) {
    return (
      <div className="field-list-container">
        <p className="field-list-message">⚠️ No project selected.</p>
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
        fields: [...(project.fields || []), newField]
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
    <div className="field-list-container">
      <CreateField onAdd={addField} />

      {(project.fields && project.fields.length > 0) ? (
        <ul className="field-list-ul">
          {project.fields.map((field) => (
            <li
              key={field.id}
              className="field-list-item"
              onClick={() => onSelectField(field)}
            >
              {field.name}
            </li>
          ))}
        </ul>
      ) : (
        <p className="field-list-message">📭 No fields yet. Add one above.</p>
      )}
    </div>
  );
}
