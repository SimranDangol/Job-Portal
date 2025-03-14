import mongoose, { Document, Schema, Types } from "mongoose";

// Company Interface
export interface Company {
  name: string;
  description?: string;
  website?: string;
  location?: string;
  logo?: {
    url: string;
    public_id: string;
  };
  userId: Types.ObjectId;
}

export interface CompanyDocument extends Company, Document {
  createdAt: Date;
  updatedAt: Date;
}

// Defining Company Schema
const companySchema = new Schema<CompanyDocument>(
  {
    name: {
      type: String,
      required: [true, "Company name is required"],
      unique: true,
    },
    description: {
      type: String,
    },
    website: {
      type: String,
    },
    location: {
      type: String,
    },
    logo: {
      url: { type: String },
      public_id: { type: String },
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Company =
  mongoose.models.Company ||
  mongoose.model<CompanyDocument>("Company", companySchema);

export default Company;
