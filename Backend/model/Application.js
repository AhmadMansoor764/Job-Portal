import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    // =====================================================
    // JOB SEEKER
    // =====================================================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // =====================================================
    // JOB
    // =====================================================

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    // =====================================================
    // COVER LETTER
    // =====================================================

    coverLetter: {
      type: String,
      trim: true,
      maxlength: 5000,
    },

    // =====================================================
    // CV
    // =====================================================

    cv: {
      url: {
        type: String,
        default: null,
      },

      publicId: {
        type: String,
        default: null,
      },

      originalName: {
        type: String,
        default: null,
      },

      size: {
        type: Number,
        default: null,
      },

      mimeType: {
        type: String,
        default: null,
      },
    },

    // interview schedule
    interview: {
      scheduled: {
        type: Boolean,
        default: false,
      },

      status: {
        type: String,
        enum: ["Scheduled", "Completed", "Cancelled"],
        default: "Scheduled",
      },

      date: {
        type: Date,
        default: null,
      },

      time: {
        type: String,
        default: "",
      },

      type: {
        type: String,
        enum: ["Online", "In Person", "Phone"],
        default: "Online",
      },

      meetingLink: {
        type: String,
        default: "",
        trim: true,
      },

      location: {
        type: String,
        default: "",
        trim: true,
      },

      notes: {
        type: String,
        default: "",
        trim: true,
        maxlength: 2000,
      },

      completedAt: {
        type: Date,
        default: null,
      },

      cancelledAt: {
        type: Date,
        default: null,
      },
    },
    // =====================================================
    // APPLICATION STATUS
    // =====================================================

    status: {
      type: String,
      enum: [
        "Applied",
        "Under Review",
        "Shortlisted",
        "Interview",
        "Rejected",
        "Accepted",
      ],
      default: "Applied",
    },

    // =====================================================
    // APPLICATION DATE
    // =====================================================

    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// =====================================================
// PREVENT DUPLICATE APPLICATIONS
// =====================================================

applicationSchema.index(
  {
    user: 1,
    job: 1,
  },
  {
    unique: true,
  },
);

const Application = mongoose.model("Application", applicationSchema);

export default Application;
