import express from 'express';
import User from '../models/User.js';
import { authenticate, authorize } from '../middleware/auth.js';
import Event from "../models/Event.js";

const router = express.Router();


router.get('/leaderboard', async (req, res) => {
  const leaderboard = await User.find()
      .select('name totalPoints eventScores')
      .sort({ totalPoints: -1 })
      .limit(20);
      

  res.json({ success: true, leaderboard });
});


router.get('/me',authenticate,  async (req, res) => {
  const user = await User.findById(req.user.id)
      .select('name email totalPoints eventScores role registeredEvents');
  res.json({ success: true, user });
});

router.post("/register-event", authenticate, async (req, res) => {
  try {
    const { eventName } = req.body;

    if (!eventName) {
      return res
        .status(400)
        .json({ success: false, message: "Event name required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let event = await Event.findOne({ code: eventName });

    if (!event) {
      event = await Event.create({
        name: eventName,
        code: eventName,
      });
    }

    const alreadyRegistered = event.participants.some(
      (p) => p.userId.toString() === user._id.toString()
    );

    if (alreadyRegistered) {
      return res.status(400).json({
        success: false,
        message: "Already registered for this event",
      });
    }

    event.participants.push({
      userId: user._id,
      name: user.name,
      email: user.email,
    });

    await event.save();

    res.json({
      success: true,
      message: "Event registered successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
