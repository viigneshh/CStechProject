import React from "react";
import "../css/AgentCard.css";

function AgentCard({ agent }) {
  return (
    <div className="agent-card">
      <h3>{agent.name}</h3>
      <p><strong>Email:</strong> {agent.email}</p>
      <p><strong>Phone:</strong> {agent.phone}</p>
    </div>
  );
}

export default AgentCard;
