import express from "express";
import userRouter from "./routes/user.route";
import jobRouter from "./routes/job.route";
import companyRouter from "./routes/company.route";
import applicationRouter from "./routes/application.route";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";

const app = express();

const DIRNAME = path.resolve();

app.use(bodyParser.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:5173", "https://job-portal-0gzc.onrender.com"],
    credentials: true,
  })
);

app.use("/api/v1/user", userRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/company", companyRouter);
app.use("/api/v1/application", applicationRouter);

app.use(express.static(path.join(DIRNAME, "/frontend/dist")));
app.use("*", (_, res) => {
  res.sendFile(path.resolve(DIRNAME, "frontend", "dist", "index.html"));
});

export default app;
