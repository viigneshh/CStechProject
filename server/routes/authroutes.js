import express from 'express';
import { registerUser, loginUser } from '../control/usercontrol.js';
import { verifyToken } from '../middleware/verifytoken.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;
