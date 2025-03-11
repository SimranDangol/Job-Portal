import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/apiResponse";
import { ApiError } from "../utils/apiError";
import User from "../models/user.model";
import cloudinary from "../utils/cloudinary";
import getDataUri from "../utils/datauri";

// Define function signature with type for userId
export const generateRefreshandAccessTokens = async (
  userId: string
): Promise<{ accessToken: string; refreshToken: string }> => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken; // Store refresh token in the database
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

export const register = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { fullName, email, password, phoneNumber, role } = req.body;

    if (!fullName || !email || !password || !phoneNumber) {
      throw new ApiError(400, "All fields are required");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new ApiError(409, "User with this email already exists");
    }

    const user = await User.create({
      fullName,
      email,
      password,
      phoneNumber,
      role,
    });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      throw new ApiError(
        500,
        "Something went wrong while registering the user"
      );
    }

    return res
      .status(201)
      .json(new ApiResponse(200, createdUser, "User registered successfully"));
  }
);

export const login = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      throw new ApiError(400, "All fields are required");
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new ApiError(404, "User does not exist");
    }

    const isPasswordMatch = await user.isPasswordCorrect(password);

    if (!isPasswordMatch) {
      throw new ApiError(401, "Invalid credentials");
    }

    // Check if the role is correct
    if (role !== user.role) {
      throw new ApiError(
        403,
        "Access denied: User role does not match the required role."
      );
    }

    const { accessToken, refreshToken } = await generateRefreshandAccessTokens(
      user._id
    );

    // COOKIE
    const options = {
      httpOnly: true,
      secure: true,
    };

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            user: loggedInUser,
            accessToken,
            refreshToken,
          },
          "User logged in Successfully"
        )
      );
  }
);

export const logout = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user?._id;

    if (!userId) {
      throw new ApiError(401, "User not authenticated");
    }

    // Find the user and remove the refresh token
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    user.refreshToken = null; // Clear the refresh token
    await user.save({ validateBeforeSave: false });

    // Clear cookies
    const options = {
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now()), // Set expiration to now to clear cookie
    };

    return res
      .status(200)
      .cookie("accessToken", "", options)
      .cookie("refreshToken", "", options)
      .json(new ApiResponse(200, null, "User logged out successfully"));
  }
);

export const updateProfile = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { fullName, email, phoneNumber, bio, skills } = req.body;
    let resumeUrl: string | undefined;

    // Handle file upload (resume)
    if (req.file) {
      const fileUri = getDataUri(req.file);

      if (fileUri?.content) {
        try {
          const cloudResponse = await cloudinary.uploader.upload(
            fileUri.content,
            {
              folder: "resumes",
              resource_type: "auto",
            }
          );
          resumeUrl = cloudResponse.secure_url;
        } catch (error) {
          return res
            .status(500)
            .json(new ApiResponse(500, null, "File upload failed"));
        }
      } else {
        return res
          .status(400)
          .json(new ApiResponse(400, null, "Invalid file format"));
      }
    }

    // Update user profile
    const user = await User.findByIdAndUpdate(
      req.user?._id, // middleware ensures req.user exists
      {
        $set: {
          fullName,
          email,
          phoneNumber,
          "profile.bio": bio,
          "profile.skills": skills ? skills.split(", ") : undefined,
          resume: resumeUrl || undefined,
        },
      },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json(new ApiResponse(404, null, "User not found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, user, "Profile updated successfully"));
  }
);
