import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreateProject from './CreateProject';
import ProjectDetail from './ProjectDetail';
import ReviewWork from './ReviewWork';


export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [reviewProject, setReviewProject] = useState(null); // NEW state

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('http://localhost:5000/projects');
      setProjects(res.data);
    } catch (err) {
      console.error('Failed to fetch projects', err);
    }
  };

  const addProject = async (project) => {
    const exists = projects.some(
      p => p.name.trim().toLowerCase() === project.name.trim().toLowerCase()
    );
    if (exists) {
      alert('Project name already exists!');
      return;
    }

    try {
      const newProject = { ...project, fields: [] };
      const res = await axios.post('http://localhost:5000/projects', newProject);
      setProjects(prev => [...prev, res.data]);
    } catch (err) {
      console.error('Failed to add project', err);
    }
  };

  const updateProject = async (id, updatedData) => {
    try {
      const res = await axios.put(`http://localhost:5000/projects/${id}`, updatedData);
      setProjects(prev =>
        prev.map(p => (p.id === id ? res.data : p))
      );
      setEditingProject(null);
    } catch (err) {
      console.error('Failed to update project', err);
    }
  };

  const deleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await axios.delete(`http://localhost:5000/projects/${id}`);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Failed to delete project', err);
    }
  };

  return (
    <div className="pms-app-container">
      {/* If in Review mode */}
      {reviewProject ? (
        <ReviewWork
          project={reviewProject}
          goBack={() => setReviewProject(null)}
        />
      ) : selectedProject ? (
        <ProjectDetail
          project={selectedProject}
          projects={projects}
          setProjects={setProjects}
          goBack={() => setSelectedProject(null)}
        />
      ) : (
        <div className="pms-project-list">
          <h2 className="pms-main-title">Projects</h2>
          <CreateProject onAdd={addProject} />

          <ul className="pms-project-items">
            {projects.map(proj => (
              <li key={proj.id} className="pms-project-item">
                {editingProject?.id === proj.id ? (
                  <EditForm
                    project={editingProject}
                    onCancel={() => setEditingProject(null)}
                    onSave={(data) => updateProject(proj.id, data)}
                  />
                ) : (
                  <>
                    <span
                      className="pms-project-name"
                      onClick={() => setSelectedProject(proj)}
                    >
                      {proj.name}
                    </span>
                    <button
                      className="pms-btn-edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingProject(proj);
                      }}
                    >
                      ✏️
                    </button>
                    <button
                      className="pms-btn-delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteProject(proj.id);
                      }}
                    >
                      🗑️
                    </button>
                    <button
                      className="pms-btn-rework"
                      onClick={(e) => {
                        e.stopPropagation();
                        setReviewProject(proj); // Navigate to ReviewWork
                      }}
                    >
                      🔄 Review
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function EditForm({ project, onCancel, onSave }) {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      alert('Both fields are required');
      return;
    }
    onSave({ ...project, name, description });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
      className="pms-edit-form"
    >
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
}
