import express from "express";
import Event from "../models/Event.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const events = await Event.find().select("name code");
    res.json({ success: true, events });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/:code/interest", authenticate, async (req, res) => {
  try {
    const event = await Event.findOne({
      code: req.params.code.toUpperCase(),
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const alreadyInterested = event.participants.some(
      (p) => p.email === req.user.email
    );

    if (alreadyInterested) {
      return res.status(400).json({
        success: false,
        message: "Already interested in this event",
      });
    }

    event.participants.push({
      name: req.user.name,
      email: req.user.email,
    });

    await event.save();

    res.json({
      success: true,
      message: "Event recorded successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});


router.get("/:code/participants", async (req, res) => {
  const event = await Event.findOne({
    code: req.params.code.toUpperCase(),
  });

  if (!event) {
    return res.status(404).json({
      success: false,
      message: "Event not found",
    });
  }

  res.json({
    success: true,
    event: event.name,
    participants: event.participants,
  });
});

export default router;