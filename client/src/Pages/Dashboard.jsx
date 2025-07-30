import "../css/Dashboard.css";
import { useEffect, useState } from "react";
import axios from "axios";
import AgentCard from "../components/agentcard";

function Dashboard() {
  const [file, setFile] = useState(null);
  const [showAddAgent, setShowAddAgent] = useState(false);
  const [agentData, setAgentData] = useState({ name: "", email: "", phone: "", password: "" });
  const [agents, setAgents] = useState([]);

  const adminMail = localStorage.getItem("mail");

  const fetchAgents = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/agents/${adminMail}`);
      setAgents(res.data.agents);
    } catch (error) {
      console.error("Error fetching agents", error);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleAgentChange = (e) => {
    setAgentData({ ...agentData, [e.target.name]: e.target.value });
  };

  const handleAddAgent = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/agents", {
        adminMail,
        ...agentData,
      });
      alert(res.data.message);
      setAgentData({ name: "", email: "", phone: "", password: "" });
      setShowAddAgent(false);
      fetchAgents(); // refresh agent list
    } catch (error) {
      alert(error.response?.data?.message || "Error adding agent");
    }
  };

  return (
    <div className="contentWrap">
      {/* Left Sidebar */}
      <div className="leftDis">
        <button className="createpro" onClick={() => setShowAddAgent(true)}>+ Add Agent</button>
      </div>

      {/* Center Content */}
      <div className="centerDis">
        <h2>Agents</h2>
        {agents.length > 0 ? (
          agents.map((agent) => <AgentCard key={agent._id} agent={agent} />)
        ) : (
          <p>No agents found</p>
        )}
      </div>

      {/* Add Agent Modal */}
      {showAddAgent && (
        <div className="createprofrm">
          <form className="frm" onSubmit={handleAddAgent}>
            <h2>Add Agent</h2>
            <input type="text" name="name" placeholder="Agent Name" value={agentData.name} onChange={handleAgentChange} required />
            <input type="email" name="email" placeholder="Agent Email" value={agentData.email} onChange={handleAgentChange} required />
            <input type="text" name="phone" placeholder="+91XXXXXXXXXX" value={agentData.phone} onChange={handleAgentChange} required />
            <input type="password" name="password" placeholder="Password" value={agentData.password} onChange={handleAgentChange} required />
            <div className="btnRow">
              <button type="button" className="cancelBtn" onClick={() => setShowAddAgent(false)}>Cancel</button>
              <button type="submit" className="submitBtn">Add Agent</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
