import express from 'express';
import { registerUser, loginUser } from '../control/usercontrol.js';
import { verifyToken } from '../middleware.js/verifytoken.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// ✅ Use GET and send response after verification
router.get('/verify', verifyToken, (req, res) => {
  res.json({ message: "Token is valid", user: req.user });
});

export default router;
