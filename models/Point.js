import mongoose from "mongoose";

const pointSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  points: { type: Number, required: true },
  reason: { type: String },
  givenBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

const Point = mongoose.model("Point", pointSchema);
export default Point;
