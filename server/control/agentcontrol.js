import Agent from "../model/agentModel.js";
import bcrypt from "bcryptjs";

export const addAgent = async (req, res) => {
  try {
    const { adminMail, name, email, phone, password } = req.body;

    if (!adminMail || !name || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await Agent.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Agent already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const agent = await Agent.create({
      adminMail,
      name,
      email,
      phone,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Agent added successfully",
      agent: {
        id: agent._id,
        name: agent.name,
        email: agent.email,
        phone: agent.phone,
        adminMail: agent.adminMail,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
// In agentcontrol.js
export const getAgents = async (req, res) => {
  try {
    const { adminMail } = req.params;
    const agents = await Agent.find({ adminMail });
    res.json({ agents });
  } catch (error) {
    res.status(500).json({ message: "Error fetching agents" });
  }
};
