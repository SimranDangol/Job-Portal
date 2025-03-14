import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import Company from "../models/company.model";
import { Request, Response } from "express";
import cloudinary from "../utils/cloudinary";

export const registerCompany = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { companyName, description, website, location, logo } = req.body;


    if (!req.user) {
      throw new ApiError(401, "User not authenticated");
    }

    const userId = req.user._id;

    if (!companyName) {
      throw new ApiError(400, "Company name is required");
    }

    const existingCompany = await Company.findOne({ name: companyName });

    if (existingCompany) {
      throw new ApiError(400, "Cannot register the same company twice");
    }

    try {
      const company = await Company.create({
        name: companyName,
        description,
        website,
        location,
        logo,
        userId,
      });

      console.log("Created company:", company);

   
      if (!company || !company._id) {
        throw new ApiError(500, "Failed to create company with valid ID");
      }

      return res
        .status(200)
        .json(new ApiResponse(200, company, "Company registered successfully"));
    } catch (error) {
      console.error("Error creating company:", error);
      throw new ApiError(
        500,
        "Something went wrong while registering the company"
      );
    }
  }
);

export const getCompany = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    if (!req.user) {
      throw new ApiError(401, "User not authenticated");
    }

    const userId = req.user._id;
   
    const companies = await Company.find({ userId });

    // Check if the user has registered any companies
    if (!companies || companies.length === 0) {
      throw new ApiError(404, "No companies found for the user");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, companies, "Companies fetched successfully"));
  }
);

export const getCompanyById = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const companyId = req.params.id;

    const company = await Company.findById(companyId);

    if (!company) {
      throw new ApiError(404, "Company not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, company, "Company fetched successfully"));
  }
);

export const updateCompany = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const { name, description, website, location } = req.body;

  
    const existingCompany = await Company.findById(id);

    if (!existingCompany) {
      throw new ApiError(404, "Company not found");
    }

  
    const updateData: any = {
      name,
      description,
      website,
      location,
    };

    // Handle file upload if a file is included
    if (req.file) {
      try {
        // Upload to cloudinary
        const result = await cloudinary.uploader.upload(
          `data:${req.file.mimetype};base64,${req.file.buffer.toString(
            "base64"
          )}`,
          {
            folder: "company_logos",
            resource_type: "image",
          }
        );

       
        updateData.logo = result.secure_url;
      } catch (error) {
        console.error("Error uploading file to Cloudinary:", error);
        throw new ApiError(500, "Error uploading company logo");
      }
    }


    const updatedCompany = await Company.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedCompany, "Company updated successfully")
      );
  }
);
