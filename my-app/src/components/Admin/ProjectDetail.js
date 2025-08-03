import React, { useState } from 'react';
import FieldList from './FieldList';
import SubfieldList from './SubfieldList';

export default function ProjectDetail({ project, projects, setProjects, goBack }) {
  const [selectedField, setSelectedField] = useState(null);

  // refresh the project reference to get latest fields
  const currentProject = projects.find(p => p.id === project.id);

  return (
    <div>
      <button onClick={goBack} className="back-btn">← Back to Projects</button>
      <h3>{currentProject.name}</h3>

      {!selectedField ? (
        <>
          <h4>Fields</h4>
          <FieldList 
            project={currentProject} 
            setProjects={setProjects} 
            onSelectField={setSelectedField}
          />
        </>
      ) : (
        <>
          <button onClick={() => setSelectedField(null)} className="back-btn">← Back to Fields</button>
          <SubfieldList 
            field={selectedField} 
            project={currentProject} 
            setProjects={setProjects} 
          />
        </>
      )}
    </div>
  );
}
