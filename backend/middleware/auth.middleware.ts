import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User, { UserDocument } from "../models/user.model";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";

interface DecodedToken extends JwtPayload {
  _id: string;
}

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

      if (!token) {
        const authHeader = req.header("Authorization");
        if (authHeader?.startsWith("Bearer ")) {
          token = authHeader.replace("Bearer ", "");
        }
      }

      if (!token) {
        throw new ApiError(401, "Unauthorized request");
      }

      const decodedToken = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string
      ) as DecodedToken;

      const user = await User.findById(decodedToken._id).select(
        "-password -refreshToken"
      );

      if (!user) {
        throw new ApiError(401, "Invalid Access Token");
      }

      req.user = user;
      next();
    } catch (error: any) {
      const errorMessage = error?.message || "Invalid access token";
      throw new ApiError(401, errorMessage);
    }
  }
);
