import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import Application from "../models/application.model";
import { Request, Response } from "express";
import Job from "../models/job.model";
import mongoose from "mongoose";

export const applyJob = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    if (!req.user) {
      throw new ApiError(401, "Unauthenicated");
    }

    const userId = req.user._id;
    const jobId = req.params.id;

    console.log('Job Application Attempt:', {
      userId,
      jobId,
      userEmail: req.user.email
    });
  
    if (!jobId) {
      throw new ApiError(400, "Job id is required");
    }

    //check if the user has already applied for the job
    const existingApplications = await Application.findOne({
      job: jobId,
      applicant: userId,
    });

    if (existingApplications) {
      throw new ApiError(400, "You have already applied for this job");
    }

    //check if the job exists
    const job = await Job.findById(jobId);
    if (!job) {
      throw new ApiError(404, "Job not found");
    }

    // creating a new application
    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
    });

    job.applications.push(newApplication._id);
    await job.save();

    return res
      .status(200)
      .json(new ApiResponse(200, "Job applied successfully"));
  }
);

export const getAppliedJobs = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    if (!req.user) {
      throw new ApiError(401, "Unauthenticated");
    }

    const userId = req.user._id;
    const applications = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        populate: {
          path: "company",
        },
      });

    // Changed: Return empty array instead of error
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          applications, // This will be [] if no applications
          applications.length > 0 
            ? "Applications retrieved successfully" 
            : "No applications found"
        )
      );
  }
);

export const getApplicants = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const jobId = req.params.id;
      console.log(`Fetching job with ID: ${jobId}`);

      // Find the job and populate applications with more fields
      const job = await Job.findById(jobId).populate({
        path: "applications",
        populate: { 
          path: "applicant",
          select: "fullName email phoneNumber resume resumeOriginalName profile" // Add more fields here
        }
      });

      if (!job) {
        console.log('Job not found');
        return res.status(404).json({
          success: false,
          message: "Job not found."
        });
      }

      const applications = job.applications || [];
      
      return res.status(200).json({
        success: true,
        message: applications.length > 0 ? "Applicants found" : "No applicants found",
        applications: applications
      });

    } catch (error) {
      console.error('Error in getApplicants:', error);
      return res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  }
);

export const updateStatus = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { status } = req.body;
    const applicationId = req.params.id;

    if (!status) {
      throw new ApiError(400, "Status is required");
    }

    // Find the application by ID
    const application = await Application.findById(applicationId);
    if (!application) {
      throw new ApiError(404, "Application not found");
    }

    // Update the status
    application.status = status.toLowerCase();
    await application.save();

    return res
      .status(200)
      .json(new ApiResponse(200, "Status updated successfully"));
  }
);
