import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';

import AssignTask from './components/AssignTask';
import AgentPage from './components/Agent/AgentPage';
import Dashboard from './components/Dashboard';

import './App.css';

export default function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <div className="header-content">
            <h1 className="app-title">Mechanical Testing App</h1>
            <nav className="app-nav">
              <NavLink to="/admin" className="nav-link">
                Admin
              </NavLink>
              <NavLink to="/agent" className="nav-link">
                Agent
              </NavLink>
              <NavLink to="/dashboard" className="nav-link">
                Dashboard
              </NavLink>
           
            </nav>
          </div>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/admin" element={<AssignTask />} />
            <Route path="/agent" element={<AgentPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
         
          </Routes>
        </main>

        <footer className="app-footer">
          &copy; 2025
        </footer>
      </div>
    </Router>
  );
}
