import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
    },

    college: {
      type: String,
    },

    year: {
      type: String,
      required: true,
    },

    major: {
      type: String,
    },

    city: {
      type: String,
    },

    state: {
      type: String,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // registeredEvents: {
    //   type: [String],
    //   default: []
    // },

    eventScores: {
      type: [
        {
          eventCode: {
            type: String,
            required: true,
            uppercase: true,
            trim: true,
          },
          points: {
            type: Number,
            default: 0,
          },
        },
      ],
      default: [],
    },

    totalPoints: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);


userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
