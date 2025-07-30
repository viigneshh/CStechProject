import mongoose from "mongoose";

const agentSchema = new mongoose.Schema(
  {
    adminMail: {
      type: String,
      required: [true, "Admin email is required"],
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email"],
    },
    name: {
      type: String,
      required: [true, "Agent name is required"],
      minlength: [3, "Name must be at least 3 characters"],
    },
    email: {
      type: String,
      required: [true, "Agent email is required"],
      unique: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email"],
    },
    phone: {
      type: String,
      required: [true, "Mobile number is required"],
      match: [/^\+\d{1,4}\d{6,14}$/, "Enter valid phone number with country code"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Agent", agentSchema);
