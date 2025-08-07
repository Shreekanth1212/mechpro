import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreateProject from './CreateProject';
import ProjectDetail from './ProjectDetail';
import './ProjectList.css';

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const res = await axios.get('http://localhost:5000/projects');
    setProjects(res.data);
  };

  const addProject = async project => {
    const newProject = { ...project, fields: [] };
    const res = await axios.post('http://localhost:5000/projects', newProject);
    setProjects(prev => [...prev, res.data]);
  };

  return (
    <div className="pms-app-container">
      {!selectedProject ? (
        <div className="pms-project-list">
          <h2 className="pms-main-title">Projects</h2>
          <CreateProject onAdd={addProject} />
          <ul className="pms-project-items">
            {projects.map(proj => (
              <li 
                key={proj.id}
                className="pms-project-item"
                onClick={() => setSelectedProject(proj)}
              >
                {proj.name}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <ProjectDetail 
          project={selectedProject}
          projects={projects}
          setProjects={setProjects}
          goBack={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}