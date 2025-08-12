import React, { useState, useEffect } from 'react';
import FieldList from './FieldList';
import SubfieldList from './SubfieldList';


export default function ProjectDetail({ project, projects, setProjects, goBack }) {
  const [selectedField, setSelectedField] = useState(null);

  const currentProject = projects?.find(p => p.id === project?.id);

  useEffect(() => {
    console.log('🧩 currentProject:', currentProject);
  }, [currentProject]);

  if (!currentProject) {
    return (
      <div className="pms-project-detail">
        <button onClick={goBack} className="pms-back-btn">← Back</button>
        <p style={{ color: 'gray' }}>⚠️ Project not found. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="pms-project-detail">
      <button onClick={goBack} className="pms-back-btn">← Back to Projects</button>
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
          <button
            onClick={() => setSelectedField(null)}
            className="pms-back-btn"
          >
            ← Back to Fields
          </button>
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
