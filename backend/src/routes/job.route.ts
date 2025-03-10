import express from "express";
import { verifyJWT } from "../middleware/auth.middleware";
import {
  generateAIJobContent,
  getAdminJobs,
  getAllJobs,
  getJobById,
  postJob,
} from "../controller/job.controller";


const router = express.Router();

router.route("/post").post(verifyJWT, postJob);
router.route("/get").get(verifyJWT, getAllJobs);
router.route("/getadminjobs").get(verifyJWT, getAdminJobs);
router.route("/get/:id").get(verifyJWT, getJobById);
router.route("/generate-ai-content").post(verifyJWT, generateAIJobContent);


export default router;
