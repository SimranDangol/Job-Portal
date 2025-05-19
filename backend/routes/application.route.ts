import express from "express";
import { verifyJWT } from "../middleware/auth.middleware";
import {
  applyJob,
  getApplicants,
  getAppliedJobs,
  unapplyJob,
  updateStatus,
} from "../controller/application.controller";

const router = express.Router();

router.route("/apply/:id").post(verifyJWT, applyJob);
router.route("/get").get(verifyJWT, getAppliedJobs);
router.route("/:id/applicants").get(verifyJWT, getApplicants);
router.route("/:id/update").post(verifyJWT, updateStatus);
router.route("/unapply/:id").delete(verifyJWT, unapplyJob)

export default router;
