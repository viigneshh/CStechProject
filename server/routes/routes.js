import express from "express";
import { addAgent,getAgents } from "../control/agentcontrol.js";
import {
  uploadMiddleware,
  uploadAndDistribute,
  getDistributedLists,
} from "../control/distriControl.js";

const router = express.Router();

router.post("/agents", addAgent);
router.get("/agents/:adminMail", getAgents);
router.post("/upload", uploadMiddleware, uploadAndDistribute);
router.get("/lists/:adminMail", getDistributedLists);


export default router;
