import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AgentProjectItem from './AgentProjectItem';

export default function AgentPage() {
  const [projects, setProjects] = useState([]);
  const [openProjectId, setOpenProjectId] = useState(null); // NEW

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const res = await axios.get('http://13.233.122.10:5000/projects');
    setProjects(res.data);
  };

  return (
    <div style={{ padding: '16px', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Agent Page - Projects</h1>
      {projects.map(project => (
        <div key={project.id}>
          <div
            style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '8px' }}
            onClick={() => setOpenProjectId(openProjectId === project.id ? null : project.id)}
          >
            {project.name} {openProjectId === project.id ? '▲' : '▼'}
          </div>
          {openProjectId === project.id && (
            <AgentProjectItem
              project={project}
              setProjects={setProjects}
            />
          )}
        </div>
      ))}
    </div>
  );
}
