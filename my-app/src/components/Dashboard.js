import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PDFGenerator from './PDFGenerator';


export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [expandedProjectId, setExpandedProjectId] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/projects')
      .then(res => setProjects(res.data))
      .catch(err => console.error('Failed to fetch projects:', err));
  }, []);

  const totalSubfields = projects.reduce((sum, p) => 
    sum + p.fields.reduce((fsum, f) => fsum + f.subfields.length, 0)
  , 0);
  const passed = projects.reduce((sum, p) =>
    sum + p.fields.reduce((fsum, f) =>
      fsum + f.subfields.filter(sf => sf.agentStatus === 'pass').length
    , 0)
  , 0);
  const failed = projects.reduce((sum, p) =>
    sum + p.fields.reduce((fsum, f) =>
      fsum + f.subfields.filter(sf => sf.agentStatus === 'fail').length
    , 0)
  , 0);

  const toggleProject = (projectId) => {
    setExpandedProjectId(prev => prev === projectId ? null : projectId);
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Subfields</div>
          <div className="stat-value">{totalSubfields}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Passed</div>
          <div className="stat-value">{passed}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Failed</div>
          <div className="stat-value">{failed}</div>
        </div>
      </div>

      <div>
        {projects.map(project => {
          const isExpanded = expandedProjectId === project.id;

          const projectSubfields = project.fields.flatMap(f => f.subfields);
          const projectPassed = projectSubfields.filter(sf => sf.agentStatus === 'pass').length;
          const projectFailed = projectSubfields.filter(sf => sf.agentStatus === 'fail').length;
          const failedSubfields = project.fields.flatMap(f =>
            f.subfields.filter(sf => sf.agentStatus === 'fail')
              .map(sf => ({ ...sf, fieldName: f.name }))
          );

          return (
            <div key={project.id} className="project-card">
              <button
                onClick={() => toggleProject(project.id)}
                className="project-header"
              >
                {project.name}
              </button>

              {isExpanded && (
                <div className="project-details">
                  <div className="project-stats">
                    <div className="project-stat">
                      <div>Total Fields</div>
                      <div className="font-bold">{project.fields.length}</div>
                    </div>
                    <div className="project-stat">
                      <div>Passed Subfields</div>
                      <div className="font-bold">{projectPassed}</div>
                    </div>
                    <div className="project-stat">
                      <div>Failed Subfields</div>
                      <div className="font-bold">{projectFailed}</div>
                    </div>
                  </div>

                  <PDFGenerator project={project} />

                  <h3 className="failed-subfields-title">Failed Subfields</h3>
                  {failedSubfields.length === 0 ? (
                    <div className="all-passed-msg">All subfields passed ✅</div>
                  ) : (
                    <ul className="failed-subfields-list">
                      {failedSubfields.map(sf => (
                        <li key={sf.id} className="failed-subfield-item">
                          <div className="failed-subfield-name">
                            Subfield: {sf.name} (Field: {sf.fieldName})
                          </div>
                          <div>Status: ❌ Fail</div>
                          <div className="failed-subfield-comment">
                            Comment: {sf.agentComment || 'No comment'}
                          </div>

                          <div className="images-row">
                            {sf.agentImages?.length > 0 && (
                              <div className="image-section">
                                <div className="image-label">Agent Images</div>
                                <div className="image-list">
                                  {sf.agentImages.map((img, idx) => (
                                    <img key={idx} src={img} alt={`Agent Img ${idx}`} />
                                  ))}
                                </div>
                              </div>
                            )}

                            {sf.images?.length > 0 && (
                              <div className="image-section">
                                <div className="image-label">Subfield Images</div>
                                <div className="image-list">
                                  {sf.images.map((img, idx) => (
                                    <img key={idx} src={img} alt={`Subfield Img ${idx}`} />
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
