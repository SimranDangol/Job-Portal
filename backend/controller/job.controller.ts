import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { Request, Response } from "express";
import Job from "../models/job.model";
import mongoose from "mongoose";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initializing the Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "");
console.log("API Key:", process.env.GOOGLE_GEMINI_API_KEY);
// const apiKey = "AIzaSyBlxaD--JTBCkXBvsvI7u2wc4fJQ0fXwlQ";
// const genAI = new GoogleGenerativeAI(apiKey);
// console.log(apiKey);


export const generateAIContent = async (
  jobTitle: string,
  experience: number
) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    Generate a professional job description and a list of requirements for the position: "${jobTitle}" with ${experience} years of required experience.
    
    Tailor the description and requirements to be appropriate for someone with ${experience} years of experience. 
    If ${experience} is 0-1 years, make it entry-level focused.
    If ${experience} is 2-3 years, make it junior to mid-level focused.
    If ${experience} is 4-6 years, make it mid-level to senior focused.
    If ${experience} is 7+ years, make it senior or leadership focused.

    IMPORTANT: 
    1. Ensure each requirement is a COMPLETE sentence under 100 characters.
    2. Each requirement MUST END with proper punctuation.
    3. Ensure NO requirement is truncated or cut off mid-sentence.

    Format the response as a JSON object:
    {
      "description": "A detailed 3-4 paragraph job description.",
      "requirements": [
        "Bachelor's degree in CS, IT, or related field; equivalent experience accepted.",
        "Proficiency in relevant programming languages, frameworks, and tools.",
        "Experience with databases, APIs, and system design principles.",
        "Strong problem-solving and analytical skills.",
        "Ability to work independently and collaborate in teams.",
        "Excellent communication and documentation skills.",
        "Experience with agile development and version control systems."
      ]
    }
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("Failed to generate valid AI content");
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("AI generation error:", error);
    throw new Error("Failed to generate AI content");
  }
};

export const generateAIJobContent = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { jobTitle, experience } = req.body;

    if (!jobTitle) {
      throw new ApiError(400, "Job title is required");
    }

    // Use default experience of 0 if not provided
    const experienceLevel = typeof experience === "number" ? experience : 0;

    try {
      const aiContent = await generateAIContent(jobTitle, experienceLevel);

      return res
        .status(200)
        .json(
          new ApiResponse(200, aiContent, "AI content generated successfully")
        );
    } catch (error) {
      throw new ApiError(500, "Failed to generate AI content");
    }
  }
);

export const postJob = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const {
      title,
      description,
      requirements,
      location,
      jobType,
      experience,
      position,
      companyId,
      category, 
      useAI,
    } = req.body;

    if (!req.user) {
      throw new ApiError(401, "User not authenticated");
    }

    const userId = req.user._id;

    if (
      !title ||
      !location ||
      !jobType ||
      !experience ||
      !position ||
      !companyId
    ) {
      throw new ApiError(400, "Essential fields are required");
    }

    let finalDescription = description;
    let finalRequirements = requirements;

    // Generate description and requirements using AI if requested
    if (useAI) {
      try {
        // Pass both title and experience to the AI content generator
        const aiContent = await generateAIContent(title, experience);

        // Use AI-generated content if not provided by user
        if (!description) {
          finalDescription = aiContent.description;
        }

        if (!requirements) {
          finalRequirements = aiContent.requirements;
        }
      } catch (error) {
        throw new ApiError(
          500,
          "Failed to generate AI content. Please try again or provide your own content."
        );
      }
    }

    if (!finalDescription || !finalRequirements) {
      throw new ApiError(400, "Description and requirements are required");
    }

    // Process requirements - ensure it's an array of strings
    const processedRequirements = Array.isArray(finalRequirements)
      ? finalRequirements
      : typeof finalRequirements === "string"
      ? finalRequirements
          .split("\n")
          .map((req) => req.trim())
          .filter((req) => req.length > 0)
      : [];

    const job = await Job.create({
      title,
      description: finalDescription,
      requirements: processedRequirements,
      location,
      jobType,
      experienceLevel: experience,
      position,
      company: companyId,
      category, 

      created_by: userId,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, job, "Job created successfully"));
  }
);

// export const getAllJobs = asyncHandler(
//   async (req: Request, res: Response): Promise<Response> => {
//     // Log all query parameters to see exactly what's coming in
//     console.log("All query parameters:", req.query);

//     // Capture query parameters
//     const keyword = req.query.keyword || req.query.query || "";
//     const location = req.query.location || ""; // Added location filter
//     const industry = req.query.industry || ""; // Added industry filter
//     const category = req.query.category || ""; // Existing category filter

//     console.log("Using filters:", { keyword, location, industry, category });

//     // Build query object
//     let query: any = {};

//     // If keyword is provided, filter by title or description
//     if (keyword) {
//       query.$or = [
//         { title: { $regex: keyword, $options: "i" } },
//         { description: { $regex: keyword, $options: "i" } },
//       ];
//     }

//     // If location is provided and not "All", filter by location
//     if (location && location !== "All") {
//       query.location = { $regex: location, $options: "i" };
//       console.log("Filtering by location:", query.location);
//     }

//     // If industry is provided and not "All", filter by industry
//     if (industry && industry !== "All") {
//       query.industry = { $regex: industry, $options: "i" };
//       console.log("Filtering by industry:", query.industry);
//     }

//     // If category is provided and not "All", filter by category
//     if (category && category !== "All") {
//       query.category = { $regex: category, $options: "i" };
//       console.log("Filtering by category:", query.category);
//     }

//     console.log("Final MongoDB query:", JSON.stringify(query));

//     // Execute query
//     const jobs = await Job.find(query)
//       .populate({
//         path: "company",
//       })
//       .sort({ createdAt: -1 });

//     console.log(`Found ${jobs.length} jobs matching criteria`);

//     return res
//       .status(200)
//       .json(new ApiResponse(200, jobs, "Jobs fetched successfully"));
//   }
// );

export const getAllJobs = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    // Log all query parameters to see exactly what's coming in
    console.log("All query parameters:", req.query);

    // Capture query parameters
    const keyword = req.query.keyword || req.query.query || "";
    const location = req.query.location || ""; // Added location filter
    const industry = req.query.industry || ""; // This will map to category
    const category = req.query.category || ""; // Original category filter

    console.log("Using filters:", { keyword, location, industry, category });

    // Build query object
    let query: any = {};

    // If keyword is provided, filter by title or description
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    // If location is provided and not "All", filter by location
    if (location && location !== "All") {
      query.location = { $regex: location, $options: "i" };
      console.log("Filtering by location:", query.location);
    }

    // Changed: If industry is provided and not "All", map it to the category field
    // if (industry && industry !== "All") {
    //   // Map industry filter to the category field
    //   query.category = { $regex: industry, $options: "i" };
    //   console.log("Filtering by industry (using category field):", query.category);
    // }
    // // If category is also provided separately and not "All", AND it with the existing query
    // else if (category && category !== "All") {
    //   query.category = { $regex: category, $options: "i" };
    //   console.log("Filtering by category:", query.category);
    // }
 
    if (industry && industry !== "All") {
      query.$or = [
        { category: { $regex: industry, $options: 'i' } },
        { industry: { $regex: industry, $options: 'i' } }
      ];
    } else if (category && category !== "All") {
      query.category = { $regex: category, $options: 'i' };
    }

    console.log("Final MongoDB query:", JSON.stringify(query));

    // Execute query
    const jobs = await Job.find(query)
      .populate({
        path: "company",
      })
      .sort({ createdAt: -1 });

    console.log(`Found ${jobs.length} jobs matching criteria`);

    return res
      .status(200)
      .json(new ApiResponse(200, jobs, "Jobs fetched successfully"));
  }
);

export const getJobById = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const jobId = req.params.id;

    console.log("Job ID received:", jobId);

    // Check if the jobId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ error: "Invalid Job ID format" });
    }

    const job = await Job.findById(jobId).populate({
      path: "applications",
    });

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    return res.status(200).json({ success: true, job });
  }
);

// Admin - Get Jobs Created by Admin
export const getAdminJobs = asyncHandler(
  async (req, res): Promise<Response> => {
    const adminId = req.user?._id;
    if (!adminId) {
      throw new ApiError(401, "Unauthorized");
    }

    const jobs = await Job.find({ created_by: adminId })
      .populate("company")
      .sort({ createdAt: -1 });

    if (jobs.length === 0) {
      throw new ApiError(404, "No jobs found for this admin");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, jobs, "Jobs fetched successfully"));
  }
);
