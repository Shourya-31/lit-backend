import express from 'express';
import User from '../models/User.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();


router.get('/leaderboard', async (req, res) => {
  const leaderboard = await User.find()
      .select('name totalPoints eventScores')
      .sort({ totalPoints: -1 })
      .limit(5);

  res.json({ success: true, leaderboard });
});


router.get('/me',authenticate,  async (req, res) => {
  const user = await User.findById(req.user.id)
      .select('name email totalPoints eventScores role');
  res.json({ success: true, user });
});

export default router;
