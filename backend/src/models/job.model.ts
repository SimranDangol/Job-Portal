import mongoose, { Document, Schema, Types } from "mongoose";

// Defining Job Interface
export interface Job {
  title: string;
  description: string;
  requirements: string[];
  experienceLevel: number;
  location: string;
  category:string;
  jobType: string;
  position: number;
  company: Types.ObjectId; // Reference to Company
  created_by: Types.ObjectId; // Reference to User
  applications: Types.ObjectId[]; // Reference to multiple Applications
}

// Extend Job with timestamps
export interface JobDocument extends Job, Document {
  createdAt: Date;
  updatedAt: Date;
}

// Defining Schema
const JobSchema = new Schema<JobDocument>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    requirements: [
      {
        type: String,
      },
    ],
    experienceLevel: {
      type: Number,
      required: [true, "Experience level is required"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    category: {
      type: String,
      required: false, 
  },
    jobType: {
      type: String,
      required: [true, "Job type is required"],
    },
    position: {
      type: Number,
      required: [true, "Position is required"],
    },
    company: {
      type: Schema.Types.ObjectId, 
      ref: "Company",
      required: true,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applications: [
      {
        type: Schema.Types.ObjectId,
        ref: "Application",
      },
    ],
  },
  { timestamps: true }
);

// Prevent overwriting the model if it already exists
const Job = mongoose.models.Job || mongoose.model<JobDocument>("Job", JobSchema);

export default Job;
