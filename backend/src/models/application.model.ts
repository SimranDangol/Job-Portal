import mongoose, { Document, Schema, Types } from "mongoose";

// Application Interface
export interface Application {
  job: Types.ObjectId; // Reference to Job
  applicant: Types.ObjectId; // Reference to User
  status: "pending" | "accepted" | "rejected"; // Enum for status
}

// Extend Application with timestamps
export interface ApplicationDocument extends Application, Document {
  createdAt: Date;
  updatedAt: Date;
}

// Define Schema
const applicationSchema = new Schema<ApplicationDocument>(
  {
    job: {
      type: Schema.Types.ObjectId, // FIX: Use Schema.Types.ObjectId
      ref: "Job",
      required: true,
    },
    applicant: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Prevent overwriting the model if it already exists
const Application =
  mongoose.models.Application ||
  mongoose.model<ApplicationDocument>("Application", applicationSchema);

export default Application;
