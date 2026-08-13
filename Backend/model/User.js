import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // =====================================================
    // BASIC ACCOUNT INFORMATION
    // =====================================================

    name: {
      type: String,
      required: true,
      index: 1,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: false,
      trim: true,
    },

    location: {
      type: String,
      required: false,
      trim: true,
    },

    role: {
      type: String,
      enum: ["jobSeeker", "employer"],
      required: false,
    },

    password: {
      type: String,
      required: false,
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    // =====================================================
    // PROFILE INFORMATION
    // =====================================================

    profileImage: {
      type: String,
    },

    headline: {
      type: String,
      trim: true,
      maxlength: 120,
    },

    bio: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    // =====================================================
    // EMPLOYER / COMPANY INFORMATION
    // =====================================================

    companyType: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    industry: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    companySize: {
      type: String,
      enum: [
        "1-10",
        "11-50",
        "51-200",
        "201-500",
        "501-1000",
        "1001-5000",
        "5001-10000",
        "10000+",
      ],
      default: undefined,
    },

    foundedYear: {
      type: Number,
      min: 1800,
      max: new Date().getFullYear(),
    },

    companyWebsite: {
      type: String,
      trim: true,
    },

    companyLinkedin: {
      type: String,
      trim: true,
    },

    companyMission: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    // =====================================================
    // JOB SEEKER SKILLS
    // =====================================================

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    // =====================================================
    // EXPERIENCE
    // =====================================================

    experience: [
      {
        jobTitle: {
          type: String,
          trim: true,
        },

        company: {
          type: String,
          trim: true,
        },

        location: {
          type: String,
          trim: true,
        },

        startDate: {
          type: Date,
        },

        endDate: {
          type: Date,
        },

        currentlyWorking: {
          type: Boolean,
          default: false,
        },

        description: {
          type: String,
          trim: true,
          maxlength: 1000,
        },
      },
    ],

    // =====================================================
    // EDUCATION
    // =====================================================

    education: [
      {
        institution: {
          type: String,
          trim: true,
        },

        degree: {
          type: String,
          trim: true,
        },

        fieldOfStudy: {
          type: String,
          trim: true,
        },

        startDate: {
          type: Date,
        },

        endDate: {
          type: Date,
        },

        currentlyStudying: {
          type: Boolean,
          default: false,
        },
      },
    ],

    // =====================================================
    // PROJECTS
    // =====================================================

    projects: [
      {
        title: {
          type: String,
          required: true,
        },

        description: {
          type: String,
          required: true,
        },

        technologies: {
          type: [String],
          default: [],
        },

        liveUrl: {
          type: String,
          default: "",
        },

        githubUrl: {
          type: String,
          default: "",
        },

        startDate: {
          type: String,
          default: "",
        },

        endDate: {
          type: String,
          default: "",
        },

        currentlyWorking: {
          type: Boolean,
          default: false,
        },
      },
    ],

    // =====================================================
    // PROFESSIONAL LINKS
    // =====================================================

    linkedinUrl: {
      type: String,
      trim: true,
    },

    githubUrl: {
      type: String,
      trim: true,
    },

    portfolioUrl: {
      type: String,
      trim: true,
    },

    // =====================================================
    // RESUME
    // =====================================================

    resume: {
      url: {
        type: String,
        trim: true,
      },

      fileName: {
        type: String,
        trim: true,
      },

      publicId: {
        type: String,
        trim: true,
      },
    },

    // =====================================================
    // AUTHENTICATION
    // =====================================================

    googleId: {
      type: String,
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
  },

  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

export default User;
