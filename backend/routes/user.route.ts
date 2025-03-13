import { Router } from "express";
import {
  getSavedJobs,
  login,
  logout,
  register,
  saveJob,
  unsaveJob,
  updateProfile,
} from "../controller/user.controller"; // No need for `.js` if using TypeScript
import { verifyJWT } from "../middleware/auth.middleware";
import upload from "../middleware/multer.middleware";

const router = Router();

// Define routes
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(verifyJWT, logout);
router
  .route("/update-profile")
  .patch(verifyJWT, upload.single("resume"), updateProfile);

  router.route("/saved-jobs").get(verifyJWT, getSavedJobs);
  router.route("/save").post(verifyJWT, saveJob);
  router.route("/unsave").post(verifyJWT, unsaveJob);

export default router;
