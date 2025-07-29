import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authroutes.js';
import cors from 'cors';

dotenv.config();
import connectDB from './config/db.js';
connectDB();
const app = express();
app.use(express.json());
app.use(cors());

app.use('/auth', authRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));