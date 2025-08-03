import React, { useState } from 'react';
import AgentSubfieldItem from './AgentSubfieldItem';

export default function AgentProjectItem({ project, setProjects }) {
  const [openFieldId, setOpenFieldId] = useState(null);
  const [openSubfieldId, setOpenSubfieldId] = useState(null);

  const handleFieldClick = (fieldId) => {
    setOpenFieldId(openFieldId === fieldId ? null : fieldId);
    setOpenSubfieldId(null); // close subfields when switching field
  };

  const handleSubfieldClick = (subfieldId) => {
    setOpenSubfieldId(openSubfieldId === subfieldId ? null : subfieldId);
  };

  return (
    <div style={{ paddingLeft: '16px' }}>
      {project.fields.map((field) => (
        <div key={field.id}>
          <div
            style={{ cursor: 'pointer', margin: '4px 0', fontWeight: '500' }}
            onClick={() => handleFieldClick(field.id)}
          >
            {field.name} {openFieldId === field.id ? '▲' : '▼'}
          </div>

          {openFieldId === field.id && (
            <div style={{ paddingLeft: '16px' }}>
              {field.subfields.map((subfield) => (
                <div key={subfield.id}>
                  <div
                    style={{ cursor: 'pointer', margin: '2px 0', fontStyle: 'italic' }}
                    onClick={() => handleSubfieldClick(subfield.id)}
                  >
                    {subfield.name} {openSubfieldId === subfield.id ? '▲' : '▼'}
                  </div>

                  {openSubfieldId === subfield.id && (
                    <AgentSubfieldItem
                      project={project}
                      field={field}
                      subfield={subfield}
                      setProjects={setProjects}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
