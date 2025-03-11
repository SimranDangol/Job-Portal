import { Request, Response } from "express";
import axios from "axios";

// The AI content generation function
export const generateAIContent = async (title: string, apiKey: string): Promise<string> => {
  try {
    const response = await axios.post(
      'https://gemini.googleapis.com/v1beta2/completions', // The Gemini API endpoint
      {
        model: 'gpt-4', // Use the appropriate model
        prompt: `Generate a detailed description and requirements for the job with the title: ${title}.`,
        max_tokens: 500, // Adjust the token size as per the requirement
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].text; // Assuming the API returns a `choices` array with `text`
  } catch (error) {
    console.error('Error fetching AI content:', error);
    throw new Error('Failed to generate AI content');
  }
};

// Express route handler to use generateAIContent
export const postJob = async (req: Request, res: Response): Promise<Response> => {
  const { title, location, jobType, experience, position, companyId } = req.body;

  if (!req.user) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  const userId = req.user._id;

  if (!title || !location || !jobType || !experience || !position || !companyId) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Fetch the AI-generated description and requirements based on the job title
    const apiKey = 'YOUR_API_KEY'; // Replace with your actual API key
    const generatedContent = await generateAIContent(title, apiKey);

    // Assuming the AI content returned is structured with description and requirements
    const [description, requirements] = generatedContent.split('\n'); // Split the content accordingly

    // Create the job
    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(","),
      location,
      jobType,
      experienceLevel: experience,
      position,
      company: companyId,
      created_by: userId,
    });

    return res.status(200).json({ job, message: "Job created successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to generate AI content or create job" });
  }
};
