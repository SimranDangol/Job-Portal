import mongoose, { Document, Schema, Types } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Defining Profile Interface
interface Profile {
  bio?: string; // Optional bio field
  skills: string[]; // Array of skills
}

// Main User Interface
export interface User {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: number;
  role: "job seeker" | "recruiter"; // Enum-like union type
  profile: Profile;
  resume?: string; // Optional resume URL
  resumeOriginalName?: string; // Original resume file name
  company?: Types.ObjectId | null; // Reference to Company, optional
  profilePicture: string; // Profile picture URL
}

// Extend User with timestamps for Mongoose
export interface UserDocument extends User, Document {
  createdAt: Date;
  updatedAt: Date;
}

// Defining User Schema
const userSchema = new Schema<UserDocument>(
  {
    fullName: {
      type: String,
      required: [true, "Fullname is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      maxlength: [16, "Password should not contain more than 16 characters"],
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    role: {
      type: String,
      enum: ["job seeker", "recruiter"],
      required: true,
    },
    profile: {
      bio: { type: String },
      skills: [{ type: String }],
    },
    resume: {
      type: String, // URL to resume file
    },
    resumeOriginalName: {
      type: String,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
    },
    profilePicture: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Password Hashing Hook
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Password Comparison Method
userSchema.methods.isPasswordCorrect = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

// Access Token Generation Method
userSchema.methods.generateAccessToken = function (): string {
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  if (!accessTokenSecret) {
    throw new Error(
      "ACCESS_TOKEN_SECRET is not defined in the environment variables"
    );
  }

  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      fullName: this.fullName,
    },
    accessTokenSecret,
    {
      expiresIn: "1d", // Use string literal directly
    }
  );
};

// Refresh Token Generation Method
userSchema.methods.generateRefreshToken = function (): string {
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
  if (!refreshTokenSecret) {
    throw new Error(
      "REFRESH_TOKEN_SECRET is not defined in the environment variables"
    );
  }

  return jwt.sign(
    {
      _id: this._id,
    },
    refreshTokenSecret,
    {
      expiresIn: "15d", // Use string literal directly
    }
  );
};

// Avoid overwriting the model if it already exists
const User =
  mongoose.models.User || mongoose.model<UserDocument>("User", userSchema);

export default User;
