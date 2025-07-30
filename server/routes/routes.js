import express from "express";
import { addAgent,getAgents } from "../control/agentcontrol.js";

const router = express.Router();

router.post("/agents", addAgent);
router.get("/agents/:adminMail", getAgents);

export default router;
