import mongoose from "mongoose";
// Register the referenced model so populate("user") works in any route that only imports Job.
import "./User";

const JobSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    salary_period: {
      type: String,
      default: "per week",
      enum: ["per week", "per day", "per month", "total project"],
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    job_category: {
      type: String,
      required: true,
      trim: true,
    },
    job_type: {
      type: String,
      required: true,
      trim: true,
    },
    job_duration: {
      type: String,
      default: "1 Week",
    },
    job_experience: {
      type: String,
      required: true,
    },
    job_vacancy: {
      type: Number,
      required: true,
      min: 1,
    },
    job_deadline: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Job || mongoose.model("Job", JobSchema);
