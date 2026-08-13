import mongoose from "mongoose";

const pendingRegistrationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      enum: ["jobSeeker", "employer"],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const PendingRegistration = mongoose.model(
  "PendingRegistration",
  pendingRegistrationSchema,
);

export default PendingRegistration;
