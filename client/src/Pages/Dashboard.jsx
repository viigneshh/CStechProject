import React, { useState, useEffect } from "react";
import axios from "axios";

import "../css/Dashboard.css";

function Dashboard({ user }) {
  const [agents, setAgents] = useState([]);
  const [showAddAgent, setShowAddAgent] = useState(false);
  const [file, setFile] = useState(null);
  const [distribution, setDistribution] = useState({});

  useEffect(() => {
    fetchAgents();
  }, []);

  // Load all agents from server
  const fetchAgents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/agents");
      setAgents(res.data);
    } catch (err) {
      console.error("Failed to fetch agents:", err);
    }
  };

  // Remove agent
  const handleRemoveAgent = async (agentId) => {
    if (!window.confirm("Remove this agent?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/agents/${agentId}`);
      fetchAgents();
    } catch (err) {
      console.error("Failed to remove agent:", err);
    }
  };

  // Upload file and distribute tasks
  const handleFileUpload = async () => {
    if (!file) return alert("Please select a file first");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/upload-distribute",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setDistribution(res.data); // server returns { agentName: [{ FirstName, Phone, Notes }, ...] }
    } catch (err) {
      console.error("File upload failed:", err);
      alert("Something went wrong while uploading");
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar for agent management */}
      <div className="sidebar">
        <button className="btn add-btn" onClick={() => setShowAddAgent(true)}>
          + Add Agent
        </button>
        <h3 className="sidebar-title">Agents</h3>
        <ul className="agent-list">
          {agents.length > 0 ? (
            agents.map((agent) => (
              <li key={agent._id} className="agent-item">
                <strong>{agent.name}</strong>
                <p>{agent.email}</p>
                <p>{agent.mobile}</p>
                <button
                  className="btn remove-btn"
                  onClick={() => handleRemoveAgent(agent._id)}
                >
                  Remove
                </button>
              </li>
            ))
          ) : (
            <p className="empty-text">No agents added yet</p>
          )}
        </ul>
      </div>

      {/* Main content area */}
      <div className="main-content">
        <h2>Upload & Distribute Lists</h2>
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button className="btn upload-btn" onClick={handleFileUpload}>
          Upload & Distribute
        </button>

        {Object.keys(distribution).length > 0 && (
          <div className="distribution-section">
            <h3>Distributed Data</h3>
            {Object.entries(distribution).map(([agent, tasks]) => (
              <div key={agent} className="distribution-card">
                <h4>{agent}</h4>
                <ul>
                  {tasks.map((task, index) => (
                    <li key={index}>
                      {task.FirstName} - {task.Phone} - {task.Notes}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right-side user info */}
      <div className="user-info">
        <h4>Logged In As</h4>
        <p><strong>{user?.username}</strong></p>
        <p>{user?.email}</p>
      </div>

      {/* Modal for adding agent
      {showAddAgent && (
        <AddAgentModal
          onClose={() => setShowAddAgent(false)}
          onAgentAdded={fetchAgents}
        />
      )} */}
    </div>
  );
}

export default Dashboard;
