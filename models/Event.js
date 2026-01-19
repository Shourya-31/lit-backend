import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      uppercase: true,
      unique: true,
      trim: true,
    },
    participants: [
      {
        name: String,
        email: String,
      },
    ],
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);
export default Event;
