import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware";
import {
  getCompany,
  getCompanyById,
  registerCompany,
  updateCompany,
} from "../controller/company.controller";
import upload from "../middleware/multer.middleware";

const router = Router();

router.route("/register").post(verifyJWT, registerCompany);
router.route("/get").get(verifyJWT, getCompany);
router.route("/get/:id").get(verifyJWT, getCompanyById);
router
  .route("/update/:id")
  .put(verifyJWT, upload.single("file"), updateCompany);

export default router;
