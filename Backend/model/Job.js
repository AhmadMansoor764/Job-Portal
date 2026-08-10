import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Development",
        "Design",
        "Marketing",
        "Sales",
        "Finance",
        "Business",
        "Customer Support",
        "Human Resources",
        "Project Management",
        "Data Science",
        "Cybersecurity",
        "IT & Networking",
        "Engineering",
        "Healthcare",
        "Education",
        "Legal",
        "Writing & Translation",
        "Administrative",
        "Architecture",
        "Other",
      ],
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    companyLogo: {
      type: String,
      default: "",
    },

    companyDescription: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      required: true,
    },

    responsibilities: {
      type: [String],
      default: [],
    },

    requirements: {
      type: [String],
      default: [],
    },

    skills: {
      type: [String],
      default: [],
    },

    city: {
      type: String,
      required: true,
    },

    country: {
      type: String,
      required: true,
    },

    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship", "Temporary"],
      required: true,
    },

    workMode: {
      type: String,
      enum: ["On-site", "Remote", "Hybrid"],
      required: true,
    },

    experience: {
      type: String,
      default: "Not specified",
    },

    minSalary: {
      type: Number,
      default: null,
    },

    maxSalary: {
      type: Number,
      default: null,
    },

    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

const Job = mongoose.model("Job", jobSchema);

export default Job;
