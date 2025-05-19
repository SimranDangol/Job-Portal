import request from "supertest";
import mongoose from "mongoose";
import app from "../app";
import User from "../models/user.model";

// Connect to MongoDB before running tests
beforeAll(async () => {
  await mongoose.connect("mongodb+srv://simran:simran@cluster0.hmfz0.mongodb.net/job-portal-test?retryWrites=true&w=majority&appName=Cluster0", {
  });
});

// Cleanup after each test
afterEach(async () => {
  await User.deleteMany({}); // Clear test users
});

// Close connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

describe("User Controller", () => {
  it("should register a new job seeker successfully", async () => {
    const res = await request(app).post("/api/v1/user/register").send({
      fullName: "Job Seeker",
      email: "jobseeker@example.com", // Ensure unique email
      password: "Test@1234",
      phoneNumber: "1234567890",
      role: "job seeker",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("statusCode", 201);
    expect(res.body).toHaveProperty("message", "User registered successfully");
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("_id");
    expect(res.body.data).toHaveProperty("email", "jobseeker@example.com");
  });

  it("should return an error if required fields are missing", async () => {
    const res = await request(app).post("/api/v1/user/register").send({
      email: "test@example.com",
      password: "Test@1234",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "All fields are required");
    expect(res.body).toHaveProperty("statusCode", 400);
  });

  it("should return an error if the user already exists", async () => {
    // First, create the user
    await User.create({
      fullName: "Test User",
      email: "test@example.com",
      password: "Test@1234",
      phoneNumber: "1234567890",
      role: "job seeker",
    });

    // Try to register with the same email again
    const res = await request(app).post("/api/v1/user/register").send({
      fullName: "Test User",
      email: "test@example.com",
      password: "Test@1234",
      phoneNumber: "1234567890",
      role: "job seeker",
    });

    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty("message", "User with this email already exists");
    expect(res.body).toHaveProperty("statusCode", 409);
  });
});
