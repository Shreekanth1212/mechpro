import React from 'react';
import CreateField from './CreateField';
import axios from 'axios';

export default function FieldList({ project, setProjects, onSelectField }) {
  const addField = async field => {
    const newField = { ...field, id: Date.now(), subfields: [] };
    const updatedProject = {
      ...project,
      fields: [...project.fields, newField]
    };
    await axios.put(`http://localhost:5000/projects/${project.id}`, updatedProject);
    setProjects(prev => prev.map(p => p.id === project.id ? updatedProject : p));
  };

  return (
    <div>
      <CreateField onAdd={addField} />
      <ul>
        {project.fields.map(field => (
          <li 
            key={field.id} 
            className="item"
            onClick={() => onSelectField(field)}
          >
            {field.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
