import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import adminRoutes from "./routes/admin.js";
import eventRoutes from "./routes/event.js";

import Event from "./models/Event.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/events", eventRoutes);

app.get("/api", (req, res) => {
  res.json({ msg: "Competition Backend Running on Render!" });
});

const PORT = process.env.PORT || 5000;

const DEFAULT_EVENTS = [
  { name: "Tube Trolls 5.0", code: "TUBE TROLLS" },
  { name: "Storyforge Championship", code: "STORYFORGE" },
  { name: "Poetry Slam", code: "POETRY" },
  { name: "Essay Writing", code: "ESSAY WRITING" },
  { name: "The Literary Marathon", code: "LITERARY MARATHON" },
  { name: "Debate", code: "DEBATE" },
  { name: "The Literary Marathon", code: "LITERARY MARATHON" },
];

async function seedEventsIfNeeded() {
  for (const event of DEFAULT_EVENTS) {
    const exists = await Event.findOne({ code: event.code });
    if (!exists) {
      await Event.create({
        ...event,
        participants: [],
      });
      console.log(`Seeded event: ${event.code}`);
    }
  }
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected");

    await seedEventsIfNeeded();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
