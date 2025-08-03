import ProjectList from './Admin/ProjectList';
import './AssignTask.css';


export default function AgentTask() {
  return (
    <div className="agent-task-container">
      <h1 className="agent-task-title">Admin - Create Project / Fields / Subfields</h1>
      <ProjectList />
    </div>
  );
}
