import "../css/Dashboard.css";
import { useEffect, useState } from "react";
import axios from "axios";
import AgentCard from "../components/agentcard";

function Dashboard() {
  const [file, setFile] = useState(null);
  const [showAddAgent, setShowAddAgent] = useState(false);
  const [agentData, setAgentData] = useState({ name: "", email: "", phone: "", password: "" });
  const [agents, setAgents] = useState([]);
  const [distributions, setDistributions] = useState([]); // NEW

  const adminMail = localStorage.getItem("mail");

  const fetchAgents = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/agents/${adminMail}`);
      setAgents(res.data.agents);
    } catch (error) {
      console.error("Error fetching agents", error);
    }
  };

  const fetchDistributions = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/lists/${adminMail}`);
      setDistributions(res.data.distributions || []);
    } catch (error) {
      console.error("Error fetching distributions", error);
    }
  };

  useEffect(() => {
    fetchAgents();
    fetchDistributions();
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
      fetchAgents();
    } catch (error) {
      alert(error.response?.data?.message || "Error adding agent");
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file first");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("adminMail", adminMail);

      const res = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(res.data.message);
      setFile(null);
      fetchDistributions(); // refresh distribution list
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "File upload failed");
    }
  };

  // Group distribution items by agentId
  const getAgentItems = (agentId) => {
    const dist = distributions.find((d) => d.agentId._id === agentId);
    return dist ? dist.items : [];
  };

  return (
    <div className="contentWrap">
      {/* Left Sidebar */}
      <div className="leftDis">
        <button className="createpro" onClick={() => setShowAddAgent(true)}>+ Add Agent</button>
      </div>

      {/* Center Content */}
      <div className="centerDis">
        <h2>Upload & Distribute Lists</h2>
        <form onSubmit={handleFileUpload} className="uploadForm">
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <button type="submit" className="uploadBtn">Upload</button>
        </form>

        <h2>Agents & Distributed Lists</h2>
        {agents.length > 0 ? (
          agents.map((agent) => (
            <div key={agent._id} className="agentBlock">
              <AgentCard agent={agent} />
              <div className="distributionItems">
                {getAgentItems(agent._id).length > 0 ? (
                  getAgentItems(agent._id).map((item, idx) => (
                    <div key={idx} className="distItem">
                      <p><b>{item.firstName}</b></p>
                      <p>{item.phone}</p>
                      <p className="note">{item.notes}</p>
                    </div>
                  ))
                ) : (
                  <p className="noItems">No items assigned</p>
                )}
              </div>
            </div>
          ))
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
