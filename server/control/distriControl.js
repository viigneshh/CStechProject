import multer from "multer";
import xlsx from "xlsx";
import fs from "fs";
import Agent from "../model/agentModel.js";
import Distribution from "../model/distributionmodel.js";

// --- Multer Setup for File Upload ---
const upload = multer({ dest: "uploads/" });
export const uploadMiddleware = upload.single("file");

// --- Validate File Type ---
const isValidFile = (filename) => {
  const allowed = [".csv", ".xlsx", ".xls"];
  return allowed.some(ext => filename.endsWith(ext));
};

// --- Parse CSV or XLSX into JSON ---
const parseFile = (filePath) => {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  return xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
};

// --- Upload & Distribute ---
export const uploadAndDistribute = async (req, res) => {
  try {
    const { adminMail } = req.body;
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    if (!isValidFile(req.file.originalname)) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "Invalid file format. Upload CSV/XLSX only." });
    }

    // Parse file
    const data = parseFile(req.file.path);
    fs.unlinkSync(req.file.path); // remove temp file

    // Validate CSV columns
    const requiredFields = ["FirstName", "Phone", "Notes"];
    const invalidRow = data.find(
      (row) => !row.FirstName || !row.Phone || !("Notes" in row)
    );
    if (invalidRow) {
      return res.status(400).json({ message: "CSV/XLSX file format incorrect" });
    }

    // Get all agents of this admin
    const agents = await Agent.find({ adminMail });
    if (agents.length < 1) return res.status(400).json({ message: "No agents found for admin" });

    // Distribute equally
    const itemsPerAgent = Math.floor(data.length / agents.length);
    let extra = data.length % agents.length;
    let index = 0;
    let distributions = [];

    for (const agent of agents) {
      let count = itemsPerAgent + (extra > 0 ? 1 : 0);
      extra = extra > 0 ? extra - 1 : extra;

      const assignedItems = data.slice(index, index + count);
      index += count;

      const dist = new Distribution({
        adminMail,
        agentId: agent._id,
        items: assignedItems.map((item) => ({
          firstName: item.FirstName,
          phone: item.Phone,
          notes: item.Notes,
        })),
      });

      await dist.save();
      distributions.push(dist);
    }

    res.json({ message: "File processed & tasks distributed", distributions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// --- Get Distributed Lists for Admin ---
export const getDistributedLists = async (req, res) => {
  try {
    const { adminMail } = req.params;
    const data = await Distribution.find({ adminMail }).populate("agentId", "name email phone");
    res.json({ distributions: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
