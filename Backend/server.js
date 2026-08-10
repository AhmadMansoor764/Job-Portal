import "dotenv/config";
import express from "express";
import connectDB from "./config/db.js";
import authRoutes from "./Routes/authRoutes.js";
import cookieParser from "cookie-parser";
import jobRoutes from "./Routes/jobRoutes.js";
import applicationRoutes from "./Routes/applicationRoutes.js";
import profileRoutes from "./Routes/profileRoutes.js";
import jobSeekerDashboardRoutes from "./Routes/jobSeekerDashboardRoutes.js";
import employerDashboardRoutes from "./Routes/employerDashboardRoutes.js";
import cors from "cors";

console.log("SUPABASE URL:", process.env.SUPABASE_URL);
const app = express(); // ✅ Create app first

const PORT = process.env.PORT || 5000;

connectDB();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(cookieParser());

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/job-seeker/dashboard", jobSeekerDashboardRoutes);

app.use("/api/employer/dashboard", employerDashboardRoutes);

app.use("/api/jobs", jobRoutes);

app.use("/api/applications", applicationRoutes);

app.use("/api/profile", profileRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
