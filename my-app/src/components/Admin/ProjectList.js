import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreateProject from './CreateProject';
import ProjectDetail from './ProjectDetail';

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const res = await axios.get('http://13.233.122.10:5000/projects');
    setProjects(res.data);
  };

  const addProject = async project => {
    const newProject = { ...project, fields: [] };
    const res = await axios.post('http://13.233.122.10:5000/projects', newProject);
    setProjects(prev => [...prev, res.data]);
  };

  return (
    <div>
      {!selectedProject ? (
        <>
          <h2>Projects</h2>
          <CreateProject onAdd={addProject} />
          <ul>
            {projects.map(proj => (
              <li 
                key={proj.id} 
                className="item" 
                onClick={() => setSelectedProject(proj)}
              >
                {proj.name}
              </li>
            ))}
          </ul>
        </>
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
