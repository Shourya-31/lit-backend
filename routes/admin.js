import express from "express";
import User from "../models/User.js";
import Point from "../models/Point.js";
import { authenticate, authorize } from "../middleware/auth.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();


router.post("/adminlogin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ success: false, msg: "Admin not found" });

    if (user.role !== "admin")
      return res.status(403).json({ success: false, msg: "Not an admin" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ success: false, msg: "Wrong password" });


    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      admin: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});


router.post(
  "/users/:id/events/:eventCode/points",
  authenticate,
  authorize(["admin"]),
  async (req, res) => {
    try {
      const { points, reason } = req.body;
      const { id: userId, eventCode } = req.params;

      const targetUser = await User.findById(userId);
      if (!targetUser) {
        return res.status(404).json({ success: false, msg: "User not found" });
      }

      const eventIndex = targetUser.eventScores.findIndex(
        (e) => e.eventCode === eventCode
      );

      if (eventIndex >= 0) {
        targetUser.eventScores[eventIndex].points += points;
      } else {
        targetUser.eventScores.push({ eventCode, points });
      }

      targetUser.totalPoints += points;
      await targetUser.save();

      const point = new Point({
        userId,
        eventId: null,
        points,
        reason,
        givenBy: req.user._id,
      });
      await point.save();

      res.json({
        success: true,
        msg: `+${points} pts for ${eventCode} to ${targetUser.name}`,
        totalPoints: targetUser.totalPoints,
      });
    } catch (err) {
      res.status(500).json({ success: false, msg: err.message });
    }
  }
);


router.get(
  "/users",
  authenticate,
  authorize(["admin"]),
  async (req, res) => {
    const users = await User.find()
      .select("name email totalPoints eventScores role")
      .sort({ totalPoints: -1 });

    res.json({ success: true, users });
  }
);

export default router;
