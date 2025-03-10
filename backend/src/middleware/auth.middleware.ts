import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User, { UserDocument } from "../models/user.model";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";

// Define the interface for the decoded token
interface DecodedToken extends JwtPayload {
  _id: string;
}

// Extend the Express Request interface
declare global {
    namespace Express {
      interface Request {
        user?: UserDocument;
      }
    }
  }

export const verifyJWT = asyncHandler(
  async (req: Request, _: Response, next: NextFunction): Promise<void> => {
    try {
      let token = req.cookies?.accessToken;

      // If no cookie token, check the Authorization header
      if (!token) {
        const authHeader = req.header("Authorization");
        if (authHeader?.startsWith("Bearer ")) {
          token = authHeader.replace("Bearer ", "");
        }
      }

      if (!token) {
        throw new ApiError(401, "Unauthorized request");
      }

      // Verifying token and decoding it
      const decodedToken = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string
      ) as DecodedToken;

      // Find the user associated with the decoded token
      const user = await User.findById(decodedToken._id).select("-password -refreshToken");

      if (!user) {
        throw new ApiError(401, "Invalid Access Token");
      }

      // Attach the user to the request object
      req.user = user;
      next();
    } catch (error: any) {
      // Accessing the message property correctly
      const errorMessage = error?.message || "Invalid access token";
      throw new ApiError(401, errorMessage);
    }
  }
);
