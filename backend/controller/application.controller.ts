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
      throw new ApiError(401, "Unauthenticated");
    }

    const userId = req.user._id;
    const jobId = req.params.id;

    console.log("Job Application Attempt:", {
      userId,
      jobId,
      userEmail: req.user.email,
    });

    if (!jobId) {
      throw new ApiError(400, "Job id is required");
    }

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      throw new ApiError(400, "Invalid job id format");
    }

    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });

    if (existingApplication) {
      throw new ApiError(400, "You have already applied for this job");
    }

    const job = await Job.findById(jobId);
    if (!job) {
      throw new ApiError(404, "Job not found");
    }

    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
    });

    job.applications.push(newApplication._id);
    await job.save();

    return res
      .status(201)
      .json(new ApiResponse(201, newApplication, "Job applied successfully"));
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

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          applications,
          applications.length > 0
            ? "Applications retrieved successfully"
            : "No applications found"
        )
      );
  }
);

export const getApplicants = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const jobId = req.params.id;

    console.log(`Fetching applicants for job ID: ${jobId}`);

    if (!jobId) {
      throw new ApiError(400, "Job ID is required");
    }

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      throw new ApiError(400, "Invalid job ID format");
    }

    try {
      const job = await Job.findById(jobId).populate({
        path: "applications",
        populate: {
          path: "applicant",
          select:
            "fullName email phoneNumber resume resumeOriginalName profile",
        },
      });

      if (!job) {
        console.log("Job not found");
        throw new ApiError(404, "Job not found");
      }

      const applications = job.applications || [];

      console.log(`Found ${applications.length} applications for job ${jobId}`);

      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            applications,
            applications.length > 0
              ? `Found ${applications.length} applicant${
                  applications.length > 1 ? "s" : ""
                }`
              : "No applicants found"
          )
        );
    } catch (error) {
      console.error("Error in getApplicants:", error);

      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(
        500,
        "Internal server error while fetching applicants"
      );
    }
  }
);

export const updateStatus = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { status } = req.body;
    const applicationId = req.params.id;

    console.log("Update Status Request:", { applicationId, status });

    if (!applicationId) {
      throw new ApiError(400, "Application ID is required");
    }

    if (!status) {
      throw new ApiError(400, "Status is required");
    }

    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      throw new ApiError(400, "Invalid application ID format");
    }

    const validStatuses = ["pending", "accepted", "rejected"];
    const normalizedStatus = status.toLowerCase().trim();

    let backendStatus = normalizedStatus;
    if (normalizedStatus === "approved") {
      backendStatus = "accepted";
    } else if (normalizedStatus === "disapproved") {
      backendStatus = "rejected";
    }

    if (!validStatuses.includes(backendStatus)) {
      throw new ApiError(
        400,
        `Invalid status value. Valid options are: ${validStatuses.join(", ")}`
      );
    }

    try {
      const application = await Application.findById(applicationId);
      if (!application) {
        throw new ApiError(404, "Application not found");
      }

      if (
        application.status === "accepted" ||
        application.status === "rejected"
      ) {
        throw new ApiError(
          400,
          "Status cannot be changed once it is accepted or rejected"
        );
      }

      application.status = backendStatus;
      const updatedApplication = await application.save();

      console.log("Status updated successfully:", {
        applicationId,
        oldStatus: application.status,
        newStatus: backendStatus,
      });

      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            updatedApplication,
            "Status updated successfully"
          )
        );
    } catch (error) {
      console.error("Error updating application status:", error);
      if (
        error &&
        typeof error === "object" &&
        "name" in error &&
        error.name === "ValidationError"
      ) {
        const mongooseError = error as any;
        const validationErrors = Object.values(mongooseError.errors).map(
          (err: any) => err.message
        );
        throw new ApiError(
          400,
          `Validation error: ${validationErrors.join(", ")}`
        );
      }

      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(500, "Internal server error while updating status");
    }
  }
);

export const unapplyJob = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    if (!req.user) {
      throw new ApiError(401, "Unauthenticated");
    }

    const userId = req.user._id;
    const jobId = req.params.id;

    if (!jobId) {
      throw new ApiError(400, "Job id is required");
    }

    const application = await Application.findOne({
      job: jobId,
      applicant: userId,
    });

    if (!application) {
      throw new ApiError(404, "Application not found");
    }

    await Job.findByIdAndUpdate(jobId, {
      $pull: { applications: application._id },
    });

    await Application.findByIdAndDelete(application._id);

    return res
      .status(200)
      .json(new ApiResponse(200, "Application withdrawn successfully"));
  }
);
