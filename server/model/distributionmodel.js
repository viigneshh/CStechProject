import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  phone: { type: String, required: true },
  notes: { type: String, required: false }
});

const distributionSchema = new mongoose.Schema(
  {
    adminMail: { type: String, required: true },
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: "Agent", required: true },
    items: [itemSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Distribution", distributionSchema);
