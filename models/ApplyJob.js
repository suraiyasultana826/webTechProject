import mongoose from "mongoose";
// Register the referenced models so populate() works in any route that only imports ApplyJob.
import "./User";
import "./Job";

const ApplyJobSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    name: {
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
    about: {
      type: String,
      required: true,
    },
    cv: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "accepted", "rejected"],
    },
  },
  { timestamps: true }
);

export default mongoose.models.AppliedJobStatus || mongoose.model("AppliedJobStatus", ApplyJobSchema);
